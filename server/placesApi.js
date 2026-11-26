// 개발/미리보기 서버의 /api/places. 저장해 둔 비짓제주 데이터에서 지도에 필요한 것만 보낸다.
// 배포용 서버 함수(api/)는 아직 없다.
import { readFile } from 'node:fs/promises';

const DATA = new URL('../data/visitjeju_kr.json', import.meta.url);
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

export default function placesApi() {
  const use = (server) => {
    server.middlewares.use('/api/places', handle);
  };
  return { name: 'places-api', configureServer: use, configurePreviewServer: use };
}
