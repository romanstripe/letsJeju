// 비짓제주 데이터 점검 스크립트
// 실행: node scripts/check-visitjeju.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('../', import.meta.url);
// http 는 응답 없이 연결이 끊겨서 https 를 쓴다 (2026-11-26 확인)
const API = 'https://api.visitjeju.net/vsjApi/contents/searchList';
const OUT = new URL('data/visitjeju_kr.json', ROOT);
const DELAY_MS = 300;

process.loadEnvFile(fileURLToPath(new URL('.env.local', ROOT)));
const KEY = process.env.VISITJEJU_API_KEY;
if (!KEY) {
  console.error('.env.local 에 VISITJEJU_API_KEY 가 없습니다.');
  process.exit(1);
}

// 에러 응답은 그대로 보여주되, 키가 섞여 있으면 가린다
const mask = (text) => text.replaceAll(KEY, '***');

async function fetchPage(locale, page) {
  const url = `${API}?${new URLSearchParams({ apiKey: KEY, locale, page })}`;
  const where = `locale=${locale} page=${page}`;
  let res, body;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    body = await res.text();
  } catch (err) {
    throw new Error(`요청 실패 (${where}): ${err.message} ${err.cause?.message ?? ''}`);
  }

  const fail = () =>
    new Error(`에러 응답 (${where}) HTTP ${res.status} ${res.statusText}\n${mask(body)}`);
  if (!res.ok) throw fail();

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw fail();
  }
  if (!Array.isArray(json.items) || json.items.length === 0) throw fail();
  return json;
}

async function fetchAll(locale) {
  const first = await fetchPage(locale, 1);
  const { pageCount, totalCount } = first;
  if (!Number.isInteger(pageCount)) {
    throw new Error(`응답에 pageCount 가 없습니다: ${mask(JSON.stringify(first)).slice(0, 2000)}`);
  }
  console.log(`totalCount=${totalCount}, pageCount=${pageCount}`);

  const items = [...first.items];
  for (let page = 2; page <= pageCount; page++) {
    await sleep(DELAY_MS);
    items.push(...(await fetchPage(locale, page)).items);
    if (page % 10 === 0 || page === pageCount) {
      console.log(`  ${page}/${pageCount} 페이지, ${items.length}개`);
    }
  }
  return { items, totalCount };
}

function countBy(values) {
  const map = new Map();
  for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
  return [...map].sort((a, b) => b[1] - a[1]);
}

const isBlank = (v) => v === null || v === undefined || String(v).trim() === '' || Number(v) === 0;

function report(items, totalCount) {
  const uniqueIds = new Set(items.map((i) => i.contentsid)).size;
  console.log('\n=== 전체 개수 ===');
  console.log(`받은 항목 ${items.length} / API totalCount ${totalCount} / 고유 contentsid ${uniqueIds}`);

  console.log('\n=== contentscd 별 개수 (value, label) ===');
  const categories = countBy(
    items.map((i) => `${i.contentscd?.value ?? '(없음)'}\t${i.contentscd?.label ?? '(없음)'}`),
  );
  for (const [key, n] of categories) console.log(`${key}\t${n}`);

  // 한 항목 안에서 중복된 태그는 한 번만 센다
  const tags = countBy(
    items.flatMap((i) => [
      ...new Set(String(i.alltag ?? '').split(',').map((t) => t.trim()).filter(Boolean)),
    ]),
  );
  console.log(`\n=== alltag 태그 빈도 상위 60 (태그 종류 ${tags.length}개) ===`);
  tags.slice(0, 60).forEach(([tag, n], idx) => console.log(`${idx + 1}\t${tag}\t${n}`));

  const noLat = items.filter((i) => isBlank(i.latitude)).length;
  const noLng = items.filter((i) => isBlank(i.longitude)).length;
  const noEither = items.filter((i) => isBlank(i.latitude) || isBlank(i.longitude)).length;
  console.log('\n=== 위도/경도 비어 있는 항목 (null, 빈 문자열, 0) ===');
  console.log(`위도 없음 ${noLat} / 경도 없음 ${noLng} / 둘 중 하나라도 없음 ${noEither}`);
}

async function checkEnglish(krItems) {
  await sleep(DELAY_MS);
  const { items } = await fetchPage('en', 1);
  const krTitles = new Map(krItems.map((i) => [i.contentsid, i.title]));
  const matched = items.filter((i) => krTitles.has(i.contentsid));
  const hangul = matched.filter((i) => /[가-힣]/.test(i.title ?? ''));
  const empty = matched.filter((i) => !i.title?.trim());

  console.log('\n=== locale=en 1페이지 확인 ===');
  console.log(`en 항목 ${items.length} / kr 에 같은 contentsid 있음 ${matched.length}`);
  console.log(`그중 title 에 한글 포함 ${hangul.length} / title 비어 있음 ${empty.length}`);
  console.log('\n샘플 10개 (contentsid | kr | en)');
  for (const i of matched.slice(0, 10)) {
    console.log(`${i.contentsid} | ${krTitles.get(i.contentsid)} | ${i.title}`);
  }
  if (hangul.length) {
    console.log('\n한글이 섞인 en title');
    for (const i of hangul.slice(0, 20)) {
      console.log(`${i.contentsid} | ${krTitles.get(i.contentsid)} | ${i.title}`);
    }
  }
}

try {
  const { items, totalCount } = await fetchAll('kr');
  await mkdir(new URL('data/', ROOT), { recursive: true });
  await writeFile(OUT, JSON.stringify(items, null, 2), 'utf8');
  console.log(`저장: data/visitjeju_kr.json (${items.length}개)`);
  report(items, totalCount);
  await checkEnglish(items);
} catch (err) {
  console.error(`\n${err.message}`);
  process.exitCode = 1;
}
