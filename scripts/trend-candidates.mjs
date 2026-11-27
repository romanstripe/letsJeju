// 네이버 블로그·뉴스와 유튜브에서 제주 트렌드 장소 후보를 뽑는 스크립트
// 네이버는 API HUB(네이버 클라우드) 방식. .env.local 의 키도 HUB Application 의 Client ID/Secret
// 유튜브는 YouTube Data API v3 (.env.local 의 GOOGLE_YOUTUBE_KEY)
// 실행: node scripts/trend-candidates.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('../', import.meta.url);
const BASE = 'https://naverapihub.apigw.ntruss.com';
const DELAY_MS = 200;
const QUERIES = [
  '제주 오픈런',
  '제주 웨이팅',
  '제주 한정판',
  // 가게가 여러 곳 나오는 정보성 글·영상
  '제주 또간집',
  '제주 맛집',
  '제주 찐맛집',
  '제주 흔치않은',
  '제주여행',
  '제주 여행코스',
  '제주 코스추천',
  '제주 맛집 리스트',
  '제주 맛집 총정리',
];
const SOURCES = ['blog', 'news'];
const YOUTUBE_PAGES = 2;
const CANDIDATE_COUNT = 100;
const TREND_COUNT = 30;
const WEEKS = 8;
const RISE = 1.1; // 최근 4주 평균이 이전 4주의 1.1배 이상이면 '증가'
const FALL = 0.9;

process.loadEnvFile(fileURLToPath(new URL('.env.local', ROOT)));
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, GOOGLE_YOUTUBE_KEY } = process.env;
if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET || !GOOGLE_YOUTUBE_KEY) {
  console.error('.env.local 에 NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, GOOGLE_YOUTUBE_KEY 가 필요합니다.');
  process.exit(1);
}

// 키는 주소가 아니라 헤더로 보낸다 (에러 출력에 키가 섞이지 않게)
async function youtube(resource, params) {
  await sleep(DELAY_MS);
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${resource}?${new URLSearchParams(params)}`, {
    headers: { 'X-goog-api-key': GOOGLE_YOUTUBE_KEY },
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`에러 응답 (youtube/${resource}) HTTP ${res.status}\n${text}`);
  return JSON.parse(text);
}

async function call(path, { params, body } = {}) {
  const url = `${BASE}/${path}${params ? `?${new URLSearchParams(params)}` : ''}`;
  await sleep(DELAY_MS);
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`에러 응답 (${path}) HTTP ${res.status}\n${text}`);
  return JSON.parse(text);
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const clean = (s = '') =>
  s
    .replace(/<\/?b>/g, '')
    .replace(/&(#\d+|\w+);/g, (m, e) =>
      e[0] === '#' ? String.fromCodePoint(Number(e.slice(1))) : (ENTITIES[e] ?? m),
    );

// ───────── 1. 글 모으기 ─────────
async function collectPosts() {
  const posts = new Map(); // 링크 기준 중복 제거
  for (const source of SOURCES) {
    for (const query of QUERIES) {
      const { items } = await call(`search/v1/${source}`, {
        params: { query, display: 100, sort: 'date' },
      });
      console.log(`${source}\t"${query}"\t${items.length}개`);
      for (const item of items) {
        const link = item.originallink || item.link;
        posts.set(link, {
          source,
          link,
          title: clean(item.title),
          description: clean(item.description),
        });
      }
    }
  }
  return [...posts.values()];
}

// 최근 8주에 올라온 영상을 조회수 순으로. 검색어당 100개(50개씩 2번)
async function collectVideos() {
  const publishedAfter = new Date(Date.now() - WEEKS * 7 * 86_400_000).toISOString();
  const videos = new Map();
  for (const query of QUERIES) {
    let pageToken;
    let count = 0;
    for (let page = 0; page < YOUTUBE_PAGES; page++) {
      const found = await youtube('search', {
        part: 'id',
        type: 'video',
        q: query,
        order: 'viewCount',
        publishedAfter,
        regionCode: 'KR',
        relevanceLanguage: 'ko',
        maxResults: 50,
        ...(pageToken && { pageToken }),
      });
      const ids = found.items.map((i) => i.id.videoId);
      if (ids.length) {
        // 검색 응답은 설명이 잘려 있어서 전체 설명과 조회수를 따로 받는다
        const { items } = await youtube('videos', { part: 'snippet,statistics', id: ids.join(',') });
        for (const v of items) {
          videos.set(v.id, {
            source: 'youtube',
            link: `https://www.youtube.com/watch?v=${v.id}`,
            title: v.snippet.title,
            description: v.snippet.description,
            author: v.snippet.channelId,
            views: Number(v.statistics.viewCount ?? 0),
          });
        }
        count += ids.length;
      }
      pageToken = found.nextPageToken;
      if (!pageToken) break;
    }
    console.log(`youtube\t"${query}"\t${count}개`);
  }
  return [...videos.values()];
}

// ───────── 2. 이름 후보 뽑기 ─────────
// 형태소 분석기 없이 하는 어림짐작. 모든 단어를 세면 일반 단어만 남아서
// '가게 이름이 올 만한 자리'에서만 후보를 찾고, 그 이름이 나온 글 수를 센다
const JEJU = /제주|서귀포|애월|함덕|협재|월정|성산|중문|한림|세화|우도|조천|구좌|안덕|대정|표선/;
const STOPWORDS = new Set(
  `제주 제주도 제주시 서귀포 서귀포시 애월 한림 협재 함덕 월정 월정리 세화 성산 표선 남원 중문 안덕 대정 조천 구좌 한경 우도 공항 제주공항 동쪽 서쪽 남쪽 북쪽
  오픈런 웨이팅 한정판 맛집 카페 식당 빵집 술집 베이커리 디저트 브런치 소품샵 팝업 팝업스토어 매장 가게 본점 지점
  여행 코스 일정 핫플 명소 후기 추천 내돈내산 위치 주차 메뉴 아침 점심 저녁 식사 오픈 방문 예약
  흑돼지 고기 갈치 전복 해물 국수 고기국수 보말칼국수 칼국수 해장국 김밥 소금빵 베이글 커피 감귤 한라봉
  제주에서 안녕하세요 제주바다 인트로 둘레길 제주흑우 고사리해장국
  여기 거기 이곳 그곳 저희 우리 오늘 어제 내일 이번 다음 처음 바로 직접 다시 함께 정말 진짜 너무 근처 주변 숙소 호텔`
    .split(/\s+/)
    .filter(Boolean),
);
// '도민맛집', '제주핫플', '고기집'처럼 가게 이름이 아닌 말
const GENERIC = /(맛집|핫플|여행|코스|추천|브이로그|총정리|리스트|또간집|가볼만한곳)$|^(무조건|고기집|비빔국수|밥집|분식집)$/;
const PREDICATE =/(했|였|었|았|겠|니다|어요|아요|네요|해요|에요|예요|는데|해서|하고|하며|하면|라는|있는|없는|하는)/;
const SHOP_END = /(식당|국수|김밥|상회|상점|공방|제과|커피|로스터스|해장국|분식|횟집|곳간|다방|살롱|뮤지엄|베이글|베이커리|제면소|국밥|갈비|당|옥|집)$/;
const JOSA = /(에서|으로|까지|부터|에는|에도|은|는|을|를|의|에|도|이|가)$/;
const PATTERNS = [
  /['‘“"「『〈《]([^'’‘“”"」』〉》\n]{2,20})['’”"」』〉》]/g, // 따옴표 안
  /([가-힣A-Za-z0-9]{2,20})(?:에|을|를)\s?(?:다녀|방문|들렀|들른|갔다)/g, // ○○에 다녀왔
  /(?:맛집|카페|빵집|술집|소품샵)\s*[,:｜|!-]?\s+([가-힣A-Za-z0-9]{2,20})/g, // 맛집 ○○
  /📍\s*([가-힣A-Za-z0-9 ]{3,20})/gu, // 영상 설명의 '📍 ○○'
  /^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}\s+([가-힣A-Za-z0-9 ]{3,20})/gm, // 영상 설명의 '01:23 ○○'
  /(?:상호명?|가게명|매장명)\s*[:：]\s*([가-힣A-Za-z0-9 ]{3,20})/g,
  // 목록 형식: 줄 앞이 번호·기호이고 이름 뒤가 줄 끝이나 구분 기호
  /^[ \t]*(?:\d{1,2}[.)]|[①-⑳✔✅▶📌🔸🔹•·-]️?)[ \t]*([가-힣A-Za-z0-9 ]{3,20}?)[ \t]*(?=$|[(|:：/,[–-])/gmu,
];

function normalizeName(raw) {
  let name = raw.trim().replace(/\s+/g, ' ');
  const bare = name.replace(JOSA, '');
  if (bare.length >= 3) name = bare;
  return name;
}

function isCandidate(name) {
  if (name.length < 3 || name.length > 20 || GENERIC.test(name)) return false;
  if (!/[가-힣A-Za-z]/.test(name) || /^\d/.test(name) || PREDICATE.test(name)) return false;
  // '제주 카페', '애월맛집' 처럼 일반 단어로만 된 말은 버린다
  const rest = name.split(' ').filter((w) => !STOPWORDS.has(w)).join('');
  return rest.replace(/제주도?|서귀포|애월|함덕|성산|중문|맛집|카페|여행|오픈런|웨이팅|한정판|빵집/g, '').length >= 2;
}

function findNames(text) {
  const names = PATTERNS.flatMap((p) => [...text.matchAll(p)].map((m) => m[1]));
  // '○○식당', '○○당' 처럼 가게 꼴로 끝나는 단어
  for (const word of text.split(/[^가-힣A-Za-z0-9]+/)) {
    const w = word.replace(JOSA, '');
    if (w.length >= 3 && SHOP_END.test(w)) names.push(w);
  }
  return names.map(normalizeName).filter(isCandidate);
}

const squash = (s) => s.replace(/\s/g, '').toLowerCase();

function rankCandidates(posts) {
  // 제목에 제주 지명이 없는 글은 전국 기사·다른 지역 글이 대부분이라 뺀다
  const local = posts.filter((p) => JEJU.test(p.title));
  console.log(`제목에 제주 지명이 있는 글 ${local.length}개에서 추출`);
  const texts = local.map((post) => ({
    post,
    text: `${post.title}\n${post.description}`.replace(/https?:\/\/\S+/g, ' '), // 설명 속 링크 제거
  }));

  const found = new Map(); // 띄어쓰기 무시한 키 → { name, hits: 가게 자리에 나온 횟수 }
  for (const { text } of texts) {
    for (const name of findNames(text)) {
      const entry = found.get(squash(name)) ?? { name, hits: 0 };
      entry.hits++;
      found.set(squash(name), entry);
    }
  }
  const squashed = texts.map(({ post, text }) => ({ post, text: squash(text) }));
  return [...found]
    .map(([key, { name, hits }]) => {
      const matched = squashed.filter((t) => t.text.includes(key)).map((t) => t.post);
      // 한 글은 1번. 유튜브는 설명 문구를 복붙하는 채널이 있어 한 채널을 1번으로
      const mentions = new Set(matched.map((p) => p.author ?? p.link)).size;
      return { name, hits, mentions, posts: matched };
    })
    .sort((a, b) => b.mentions - a.mentions || b.hits - a.hits)
    .slice(0, CANDIDATE_COUNT);
}

// ───────── 3. 지역 검색으로 확인 ─────────
const core = (s) =>
  s
    .replace(/\s+\S*점$/, '') // '○○ 애월점' → '○○'
    .replace(/제주(특별자치도|도)?|서귀포|\s/g, '')
    .toLowerCase();

// 지역 검색은 비슷한 것도 돌려주므로 상호가 후보 이름과 맞는지도 본다
function sameName(title, name) {
  const a = core(title);
  const b = core(name);
  return b.length >= 2 && a === b; // 앞부분만 같은 건 다른 곳일 수 있어 제외
}

async function verify(candidate) {
  const { items } = await call('search/v1/local', {
    params: { query: `제주 ${candidate.name}`, display: 5 },
  });
  const hit = items.find((item) => {
    const address = item.roadAddress || item.address;
    return (
      address.startsWith('제주') &&
      sameName(clean(item.title), candidate.name) &&
      !/숙박|펜션|호텔|병원|마트|편의점/.test(item.category) // 숙박은 안 씀, 병원·마트는 트렌드 장소가 아님
    );
  });
  if (!hit) return null;
  return {
    name: candidate.name,
    placeName: clean(hit.title),
    mentions: candidate.mentions,
    sources: countSources(candidate.posts),
    views: candidate.posts.reduce((sum, p) => sum + (p.views ?? 0), 0),
    address: hit.roadAddress || hit.address,
    category: hit.category,
    // 지역 검색 좌표는 WGS84 × 10,000,000
    lat: Number(hit.mapy) / 1e7 || null,
    lng: Number(hit.mapx) / 1e7 || null,
    // 가능하면 서로 다른 출처에서 하나씩
    links: pickLinks(candidate.posts),
  };
}

const countSources = (posts) =>
  Object.fromEntries(['youtube', 'blog', 'news'].map((s) => [s, posts.filter((p) => p.source === s).length]));

function pickLinks(posts) {
  // 제목에 이름이 있는 글이 앞에 오도록 이미 정렬된 목록에서 고른다
  const first = posts[0];
  const second = posts.find((p) => p.source !== first.source) ?? posts[1];
  return [first, second].filter(Boolean).map((p) => p.link);
}

// ───────── 4. 데이터랩 검색어트렌드 ─────────
const ymd = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86_400_000);

// 끝난 주(월~일)만 쓴다. 날짜는 한국 시간 기준
function weekRange() {
  const today = new Date(ymd(new Date(Date.now() + 9 * 3_600_000)));
  const end = addDays(today, -(today.getUTCDay() || 7)); // 지난 일요일
  const start = addDays(end, -(WEEKS * 7 - 1));
  const weeks = Array.from({ length: WEEKS }, (_, i) => ymd(addDays(start, i * 7)));
  return { startDate: ymd(start), endDate: ymd(end), weeks };
}

const average = (list) => list.reduce((sum, v) => sum + v, 0) / list.length;

async function trendOf(name, { startDate, endDate, weeks }) {
  // 후보마다 따로 요청: ratio 는 그 후보의 8주 중 최고 주 = 100 인 상대값
  const json = await call('search-trend/v1/search', {
    body: {
      startDate,
      endDate,
      timeUnit: 'week',
      keywordGroups: [{ groupName: name, keywords: [name, `제주 ${name}`] }],
    },
  });
  const byWeek = new Map(json.results[0].data.map((d) => [d.period, d.ratio]));
  // 데이터가 없는 주는 응답에서 빠지므로 0 으로 채운다
  const series = weeks.map((period) => ({ period, ratio: byWeek.get(period) ?? 0 }));
  const ratios = series.map((s) => s.ratio);
  const before = average(ratios.slice(0, WEEKS / 2));
  const after = average(ratios.slice(WEEKS / 2));
  let status = '비슷';
  if (before === 0 && after === 0) status = '데이터 없음';
  else if (after >= before * RISE) status = '증가';
  else if (after <= before * FALL) status = '감소';
  return {
    status,
    changePercent: before > 0 ? Math.round((after / before - 1) * 100) : null,
    weeks: series,
  };
}

// ───────── 실행 ─────────
let failed = false;
try {
  console.log('=== 1. 블로그·뉴스·유튜브 검색 ===');
  const posts = [...(await collectPosts()), ...(await collectVideos())];
  console.log(`중복 제거 후 ${posts.length}개`);

  console.log(`\n=== 2. 이름 후보 상위 ${CANDIDATE_COUNT}개 ===`);
  const candidates = rankCandidates(posts);
  for (const c of candidates) {
    c.posts.sort((a, b) => b.title.includes(c.name) - a.title.includes(c.name));
  }
  console.log(candidates.map((c) => `${c.name}(${c.mentions})`).join(', '));

  console.log('\n=== 3. 지역 검색 확인 ===');
  const places = [];
  for (const c of candidates) {
    const place = await verify(c);
    // 같은 가게가 다른 표기로 두 번 걸리면 언급이 많은 쪽만 남긴다
    if (place && !places.some((p) => p.placeName === place.placeName && p.address === place.address)) {
      places.push(place);
    }
  }
  console.log(`${candidates.length}개 중 ${places.length}개가 제주 장소로 확인됨`);

  console.log(`\n=== 4. 검색어트렌드 상위 ${TREND_COUNT}개 ===`);
  const range = weekRange();
  console.log(`기간 ${range.startDate} ~ ${range.endDate}`);
  try {
    for (const place of places.slice(0, TREND_COUNT)) {
      place.trend = await trendOf(place.name, range);
    }
  } catch (err) {
    // 트렌드만 실패해도 여기까지의 결과는 저장한다
    console.error(`\n${err.message}`);
    failed = true;
  }

  await mkdir(new URL('data/', ROOT), { recursive: true });
  const result = {
    generatedAt: new Date().toISOString(),
    queries: QUERIES,
    postCount: posts.length,
    trendRange: { startDate: range.startDate, endDate: range.endDate },
    candidates: candidates.map(({ name, mentions }) => ({ name, mentions })),
    places,
  };
  await writeFile(new URL('data/trend-candidates.json', ROOT), JSON.stringify(result, null, 2), 'utf8');

  console.log('\n=== 5. 결과 ===');
  console.table(
    places.map((p) => ({
      이름: p.name,
      상호: p.placeName,
      언급: p.mentions,
      '유튜브/블로그/뉴스': `${p.sources.youtube}/${p.sources.blog}/${p.sources.news}`,
      영상조회수: p.views,
      분류: p.category,
      주소: p.address,
      '8주 추세': p.trend
        ? `${p.trend.status}${p.trend.changePercent === null ? '' : ` ${p.trend.changePercent > 0 ? '+' : ''}${p.trend.changePercent}%`}`
        : '-',
    })),
  );
  console.log('근거 글');
  for (const p of places) {
    console.log(`  ${p.name}`);
    for (const link of p.links) console.log(`    ${link}`);
  }
  console.log('\n저장: data/trend-candidates.json');
} catch (err) {
  console.error(`\n${err.message}${err.cause ? `\n${err.cause.message}` : ''}`);
  failed = true;
}
if (failed) process.exitCode = 1;
