// 개발/미리보기 서버의 /api/places. 저장해 둔 비짓제주 데이터에서 지도에 필요한 것만 보낸다.
// 배포용 서버 함수(api/)는 아직 없다.
import { readFile } from 'node:fs/promises';
import { cafeNames, gourmetList } from '../src/data/gourmet.js';

const DATA = new URL('../data/visitjeju_kr.json', import.meta.url);
const TOUR_DATA = new URL('../data/tourapi_jeju_ko.json', import.meta.url);
// 숙박(c3)은 이 앱에서 안 씀. 정보/기타/미등록(c7~c9)은 지도에서 뺀다.
const CATEGORIES = new Set(['c1', 'c2', 'c4', 'c5', 'c6']);
// 좌표가 제주(추자도 포함) 밖이면 뺀다. 좌표가 없는 항목은 lat, lng 를 null 로 보낸다.
const inJeju = (lat, lng) => lat > 33 && lat < 34.1 && lng > 126 && lng < 127.1;

function toPlace(item) {
  return {
    id: item.contentsid,
    category: item.contentscd?.value,
    title: item.title,
    region: [item.region1cd?.label, item.region2cd?.label].filter(Boolean),
    introduction: item.introduction ?? '',
    tags: String(item.alltag ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    lat: Number(item.latitude) || null,
    lng: Number(item.longitude) || null,
    photo: item.repPhoto?.photoid?.thumbnailpath ?? null,
  };
}

// TourAPI 항목을 같은 모양으로. 태그와 소개글은 없다.
function fromTour(item) {
  const [city, town] = String(item.addr1 ?? '').replace('제주특별자치도 ', '').split(' ');
  return {
    id: `tour:${item.contentid}`,
    category: 'c4',
    title: item.title,
    region: [city, /[읍면]$/.test(town) ? town : null].filter(Boolean),
    introduction: '',
    tags: [],
    lat: Number(item.mapy) || null,
    lng: Number(item.mapx) || null,
    photo: item.firstimage2 || item.firstimage || null,
    fromTourApi: true, // 사진 출처 표시용
  };
}

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

// 카카오 키워드 검색. 결과는 저장하지 않고 서버가 켜져 있는 동안만 들고 있는다.
async function searchKakao(key, name, id, query) {
  query ??= name.includes('제주') ? name : `제주 ${name}`;
  const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${new URLSearchParams({ query })}`, {
    headers: { Authorization: `KakaoAK ${key}` },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`카카오 검색 HTTP ${res.status}`);
  const hit = (await res.json()).documents.find((d) => `kakao:${d.id}` === id);
  if (!hit) return null;
  const [, city, town] = (hit.road_address_name || hit.address_name).split(' ');
  return {
    id,
    category: 'c4',
    title: hit.place_name,
    region: [city, /[읍면]$/.test(town) ? town : null].filter(Boolean),
    introduction: '',
    tags: [],
    lat: Number(hit.y) || null,
    lng: Number(hit.x) || null,
    photo: null,
  };
}

// 목록의 카카오 항목을 5곳씩 검색해 byId 에 넣는다. 하나라도 실패하면 false.
async function addKakao(byId, key) {
  const targets = gourmetList.filter(([, id]) => id?.startsWith('kakao:'));
  if (!key) {
    console.error('.env.local 에 KAKAO_REST_KEY 가 없어 카카오 검색을 건너뜁니다.');
    return false;
  }
  let ok = true;
  for (let i = 0; i < targets.length; i += 5) {
    await Promise.all(
      targets.slice(i, i + 5).map(async ([name, id, query]) => {
        try {
          const place = await searchKakao(key, name, id, query);
          if (place) byId.set(id, place);
        } catch (err) {
          ok = false;
          console.error(`${name}: ${err.message}`);
        }
      }),
    );
  }
  return ok;
}

// 직접 받은 목록 밖의 API 식당·카페 판단. TourAPI 는 분류 코드(FD05 = 카페·찻집),
// 비짓제주는 분류가 없어서 이름과 태그의 낱말로 추정한다.
const CAFE_NAME = /카페|커피|베이커리|디저트|찻집|티룸|빵집|제과|다방|로스터|cafe|coffee/i;
const CAFE_TAG = /카페|커피전문|베이커리|찻집|티룸/;

// 같은 가게인지: 이름(띄어쓰기·지점 표시 제외)이 서로를 포함하고 300m 안
const plainName = (name) => name.toLowerCase().replace(/\(.*?\)|[^0-9a-z가-힣]|제주|서귀포|본점|점$/g, '');
const isSame = (a, b) => {
  const [x, y] = [plainName(a.title), plainName(b.title)];
  if (!x || !y || !(x.includes(y) || y.includes(x))) return false;
  if (!a.lat || !b.lat) return x === y;
  return Math.hypot((a.lat - b.lat) * 111000, (a.lng - b.lng) * 93000) < 300;
};

// 사진 있는 API 식당·카페. 이미 목록에 있는 곳은 뺀다. 비짓제주를 먼저, 그다음 TourAPI.
function apiFood(visit, tour, listed) {
  const tourGroup = new Map(
    tour.filter((item) => item.contenttypeid === '39').map((item) => [`tour:${item.contentid}`, item.lclsSystm2 === 'FD05' ? 'cafe' : 'restaurant']),
  );
  const fromVisit = visit
    .filter((item) => item.contentscd?.value === 'c4')
    .map((item) => {
      const place = toPlace(item);
      const cafe = CAFE_NAME.test(place.title) || place.tags.some((tag) => CAFE_TAG.test(tag));
      return { ...place, group: cafe ? 'cafe' : 'restaurant' };
    });
  const fromTourFood = tour
    .filter((item) => tourGroup.has(`tour:${item.contentid}`))
    .map((item) => ({ ...fromTour(item), group: tourGroup.get(`tour:${item.contentid}`) }));

  const kept = listed.filter((place) => place.photo);
  const added = [];
  for (const place of [...fromVisit, ...fromTourFood]) {
    if (!place.photo || (place.lat !== null && !inJeju(place.lat, place.lng))) continue;
    if (kept.some((other) => other.id === place.id || isSame(other, place))) continue;
    kept.push(place);
    added.push(place);
  }
  return added;
}

// 맛집 목록. 찾지 못한 곳은 이름만 보내고 unknown 으로 표시한다.
let gourmetCache;

async function handleGourmet(kakaoKey, req, res) {
  try {
    let body = gourmetCache;
    if (!body) {
      const [visit, tour] = await Promise.all([readJson(DATA), readJson(TOUR_DATA)]);
      const byId = new Map([
        ...visit.map((item) => [item.contentsid, toPlace(item)]),
        ...tour.map((item) => [`tour:${item.contentid}`, fromTour(item)]),
      ]);
      const complete = await addKakao(byId, kakaoKey);
      const listed = gourmetList.map(([name, id]) => ({
        ...(byId.get(id) ?? { id: `name:${name}`, title: name, unknown: true }),
        group: cafeNames.has(name) ? 'cafe' : 'restaurant',
      }));
      body = JSON.stringify([...listed, ...apiFood(visit, tour, listed)]);
      if (complete) gourmetCache = body; // 검색에 실패했으면 다음 요청 때 다시 시도
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`저장 데이터를 읽지 못했습니다: ${err.code ?? err.message}`);
  }
}

let cache;

async function handle(req, res) {
  try {
    cache ??= JSON.stringify(
      JSON.parse(await readFile(DATA, 'utf8'))
        .map(toPlace)
        .filter((p) => CATEGORIES.has(p.category) && (p.lat === null || p.lng === null || inJeju(p.lat, p.lng))),
    );
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(cache);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`data/visitjeju_kr.json 을 읽지 못했습니다 (node scripts/check-visitjeju.mjs 로 받기): ${err.code ?? err.message}`);
  }
}

export default function placesApi({ kakaoKey } = {}) {
  const use = (server) => {
    server.middlewares.use('/api/places', handle);
    server.middlewares.use('/api/gourmet', (req, res) => handleGourmet(kakaoKey, req, res));
  };
  return { name: 'places-api', configureServer: use, configurePreviewServer: use };
}
