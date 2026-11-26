// 관광공사 TourAPI 점검 스크립트 (제주 한정)
// 실행: node scripts/check-tourapi.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('../', import.meta.url);
const BASE = 'https://apis.data.go.kr/B551011';
const DELAY_MS = 300;
const ROWS = 100;
const OTHER_LANGS = ['EngService2', 'JpnService2', 'ChsService2', 'ChtService2'];

process.loadEnvFile(fileURLToPath(new URL('.env.local', ROOT)));
const RAW_KEY = process.env.TOURAPI_KEY;
if (!RAW_KEY) {
  console.error('.env.local 에 TOURAPI_KEY 가 없습니다.');
  process.exit(1);
}
// 포털의 Encoding 키와 Decoding 키 둘 다 받는다
const KEY = RAW_KEY.includes('%') ? decodeURIComponent(RAW_KEY) : RAW_KEY;
const mask = (text) =>
  [RAW_KEY, KEY, encodeURIComponent(KEY)].reduce((t, k) => t.replaceAll(k, '***'), text);

async function call(service, operation, params = {}) {
  const query = new URLSearchParams({
    serviceKey: KEY,
    MobileOS: 'ETC',
    MobileApp: 'AppTest',
    _type: 'json',
    ...params,
  });
  const where = `${service}/${operation} ${new URLSearchParams(params)}`;
  await sleep(DELAY_MS);
  let res, body;
  try {
    res = await fetch(`${BASE}/${service}/${operation}?${query}`, {
      signal: AbortSignal.timeout(60_000),
    });
    body = await res.text();
  } catch (err) {
    throw new Error(`요청 실패 (${where}): ${err.message} ${err.cause?.message ?? ''}`);
  }

  const fail = () =>
    new Error(`에러 응답 (${where}) HTTP ${res.status}\n${mask(body)}`);
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw fail();
  }
  if (!res.ok || json.response?.header?.resultCode !== '0000') throw fail();
  const data = json.response.body;
  return { items: data.items?.item ?? [], totalCount: Number(data.totalCount) };
}

async function fetchAll(service, operation, params) {
  const items = [];
  let totalCount = 0;
  for (let pageNo = 1; ; pageNo++) {
    const page = await call(service, operation, { ...params, numOfRows: ROWS, pageNo });
    totalCount = page.totalCount;
    items.push(...page.items);
    if (page.items.length === 0 || items.length >= totalCount) break;
  }
  return { items, totalCount };
}

async function save(name, items) {
  await mkdir(new URL('data/', ROOT), { recursive: true });
  await writeFile(new URL(`data/${name}`, ROOT), JSON.stringify(items, null, 2), 'utf8');
  console.log(`저장: data/${name} (${items.length}개)`);
}

function countBy(values) {
  const map = new Map();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map].sort((a, b) => b[1] - a[1]);
}

const isBlank = (v) => String(v ?? '').trim() === '' || Number(v) === 0;
const ymd = (d) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

function summarize(items, totalCount) {
  const ids = new Set(items.map((i) => i.contentid)).size;
  console.log(`받은 항목 ${items.length} / totalCount ${totalCount} / 고유 contentid ${ids}`);
  console.log(`좌표(mapx, mapy) 없음 ${items.filter((i) => isBlank(i.mapx) || isBlank(i.mapy)).length}`);
  console.log(`대표 이미지(firstimage) 없음 ${items.filter((i) => !i.firstimage).length}`);
  const outside = items.filter((i) => !String(i.addr1 ?? '').includes('제주'));
  console.log(`주소에 '제주'가 없는 항목 ${outside.length}`);
}

try {
  // 1. 제주 법정동 시도코드를 API 로 확인
  const regions = await call('KorService2', 'ldongCode2', { numOfRows: 100, pageNo: 1 });
  const jeju = regions.items.find((r) => r.name.includes('제주'));
  if (!jeju) throw new Error(`시도 목록에 제주가 없습니다: ${JSON.stringify(regions.items)}`);
  console.log(`=== 제주 법정동 시도코드 ===\n${jeju.code}\t${jeju.name}`);
  const region = { lDongRegnCd: jeju.code };

  const sigungu = await call('KorService2', 'ldongCode2', { ...region, numOfRows: 100, pageNo: 1 });
  for (const s of sigungu.items) console.log(`  ${s.code}\t${s.name}`);

  // 2. 제주 전체 관광정보
  console.log('\n=== 제주 지역기반 목록 (areaBasedList2) ===');
  const area = await fetchAll('KorService2', 'areaBasedList2', region);
  await save('tourapi_jeju_ko.json', area.items);
  summarize(area.items, area.totalCount);
  console.log('contenttypeid 별 개수');
  for (const [type, n] of countBy(area.items.map((i) => i.contenttypeid))) console.log(`  ${type}\t${n}`);

  // 3. 제주 행사 (올해 1월 1일 이후)
  const today = ymd(new Date());
  const from = `${today.slice(0, 4)}0101`;
  console.log(`\n=== 제주 행사 (searchFestival2, eventStartDate=${from}) ===`);
  const fest = await fetchAll('KorService2', 'searchFestival2', { ...region, eventStartDate: from });
  await save('tourapi_jeju_festivals_ko.json', fest.items);
  summarize(fest.items, fest.totalCount);
  const noDate = fest.items.filter((i) => !i.eventstartdate || !i.eventenddate).length;
  const ongoing = fest.items.filter((i) => i.eventstartdate <= today && i.eventenddate >= today);
  const upcoming = fest.items.filter((i) => i.eventstartdate > today);
  const ended = fest.items.filter((i) => i.eventenddate && i.eventenddate < today);
  console.log(`날짜 없음 ${noDate}`);
  console.log(`오늘(${today}) 기준: 진행 중 ${ongoing.length} / 예정 ${upcoming.length} / 종료 ${ended.length}`);
  for (const i of [...ongoing, ...upcoming].sort((a, b) => a.eventstartdate.localeCompare(b.eventstartdate))) {
    console.log(`  ${i.eventstartdate}~${i.eventenddate}\t${i.title}`);
  }
  console.log(`\n응답 필드: ${Object.keys(fest.items[0] ?? {}).join(', ')}`);
} catch (err) {
  console.error(`\n${err.message}`);
  process.exit(1);
}

// 4. 다국어 서비스: 한 건씩만 호출해서 사용 가능 여부 확인
console.log('\n=== 다국어 서비스 (제주 지역기반 목록 3건) ===');
for (const service of OTHER_LANGS) {
  try {
    const codes = await call(service, 'ldongCode2', { numOfRows: 100, pageNo: 1 });
    const jeju = codes.items.find((r) => String(r.code) === '50');
    const r = await call(service, 'areaBasedList2', { lDongRegnCd: '50', numOfRows: 3, pageNo: 1 });
    console.log(`${service}: 사용 가능, 제주 totalCount ${r.totalCount}, 코드 50=${jeju?.name ?? '(목록에 없음)'}`);
    for (const i of r.items) console.log(`  ${i.contentid}\t${i.title}`);
  } catch (err) {
    console.log(`${service}: ${err.message}`);
  }
}
