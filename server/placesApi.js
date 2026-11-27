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

// 식당·카페 목록. 저장 데이터에 없는 곳('kakao:' ID 포함)은 이름만 보내고 unknown 으로 표시한다.
// 외부 API 는 부르지 않는다.
let gourmetCache;

async function handleGourmet(req, res) {
  try {
    if (!gourmetCache) {
      const [visit, tour] = await Promise.all([readJson(DATA), readJson(TOUR_DATA)]);
      const byId = new Map([
        ...visit.map((item) => [item.contentsid, toPlace(item)]),
        ...tour.map((item) => [`tour:${item.contentid}`, fromTour(item)]),
      ]);
      const listed = gourmetList.map(([name, id]) => ({
        ...(byId.get(id) ?? { id: `name:${name}`, title: name, unknown: true }),
        group: cafeNames.has(name) ? 'cafe' : 'restaurant',
      }));
      gourmetCache = JSON.stringify([...listed, ...apiFood(visit, tour, listed)]);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(gourmetCache);
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

export default function placesApi() {
  const use = (server) => {
    server.middlewares.use('/api/places', handle);
    server.middlewares.use('/api/gourmet', handleGourmet);
  };
  return { name: 'places-api', configureServer: use, configurePreviewServer: use };
}
