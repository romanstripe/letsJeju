// 개발/미리보기 서버의 /api/trends. 고정 목록(src/data/trendPins.js) 다음에
// 저장해 둔 트렌드 후보(언급 많은 순)를 붙여 16곳을 보낸다.
// 새로 받으려면 node scripts/trend-candidates.mjs. 배포용 서버 함수(api/)는 아직 없다.
import { readFile } from 'node:fs/promises';
import { trendPhotos, trendPins } from '../src/data/trendPins.js';
import { fromTour, toPlace } from './placesApi.js';

const DATA = new URL('../data/trend-candidates.json', import.meta.url);
const VISIT_DATA = new URL('../data/visitjeju_kr.json', import.meta.url);
const TOUR_DATA = new URL('../data/tourapi_jeju_ko.json', import.meta.url);
const COUNT = 16;
const SKIP_CATEGORY = /해수욕장/; // 트렌드로 보기엔 뜬금없는 분류
const SKIP_NAME = /스타벅스/; // 어디에나 있는 체인점

const squash = (s) => s.replace(/\s/g, '');

const readJson = async (url) => JSON.parse(await readFile(url, 'utf8'));

// 같은 장소: 이름(띄어쓰기·지역·지점 표시 제외)이 같고 500m 안. 사진 있는 것만, 비짓제주를 먼저
const plainName = (name) => name.toLowerCase().replace(/\(.*?\)|[^0-9a-z가-힣]|제주|서귀포|본점|점$/g, '');
function findPlace(saved, trend) {
  if (trend.placeId) return saved.find((p) => p.id === trend.placeId);
  const name = plainName(trend.placeName);
  return saved.find(
    (p) =>
      p.photo &&
      plainName(p.title) === name &&
      (!p.lat || !trend.lat || Math.hypot((p.lat - trend.lat) * 111000, (p.lng - trend.lng) * 93000) < 500),
  );
}

// 저장해 둔 비짓제주(숙박·행사·기사 제외)와 TourAPI
async function savedPlaces() {
  const [visit, tour] = await Promise.all([readJson(VISIT_DATA), readJson(TOUR_DATA)]);
  return [
    ...visit.filter((i) => ['c1', 'c2', 'c4'].includes(i.contentscd?.value)).map(toPlace),
    ...tour.filter((i) => i.contenttypeid !== '32').map(fromTour),
  ];
}

function toTrends(places, saved) {
  const kept = [];
  // 고정한 곳이 검색 결과에도 있으면 검색량 추세를 가져온다
  const pins = trendPins.map((pin) => {
    const found = places.find((p) => p.placeName === pin.placeName);
    return { ...pin, trend: found?.trend };
  });
  for (const place of [...pins, ...places]) {
    const name = squash(place.name ?? place.placeName);
    // '송악산'과 '송악산 둘레길'처럼 겹치는 이름은 앞의 것만
    const same = (k) => {
      const other = squash(k.name ?? k.placeName);
      return other.includes(name) || name.includes(other) || squash(k.placeName) === squash(place.placeName);
    };
    if (SKIP_CATEGORY.test(place.category) || SKIP_NAME.test(place.placeName) || kept.some(same)) continue;
    kept.push(place);
  }
  return kept.slice(0, COUNT).map((place) => {
    const [, city, town] = place.address.split(' ');
    return {
      name: place.placeName,
      region: [city, /[읍면]$/.test(town) ? town : null].filter(Boolean).join(' '),
      address: place.address,
      category: place.category,
      rising: place.trend?.status === '증가',
      lat: place.lat ?? null,
      lng: place.lng ?? null,
      photo: trendPhotos[place.placeName] ?? null, // 직접 넣은 사진이 우선
      place: findPlace(saved, place) ?? null,
    };
  });
}

async function handle(req, res) {
  try {
    const [{ places }, saved] = await Promise.all([readJson(DATA), savedPlaces()]);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(toTrends(places, saved)));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`트렌드 데이터를 읽지 못했습니다 (node scripts/trend-candidates.mjs 로 받기): ${err.code ?? err.message}`);
  }
}

export default function trendsApi() {
  const use = (server) => {
    server.middlewares.use('/api/trends', handle);
  };
  return { name: 'trends-api', configureServer: use, configurePreviewServer: use };
}
