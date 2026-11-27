// 개발/미리보기 서버의 /api/events. 저장해 둔 TourAPI 제주 행사 데이터를 보낸다.
// 새로 받으려면 node scripts/check-tourapi.mjs. 배포용 서버 함수(api/)는 아직 없다.
import { readFile } from 'node:fs/promises';

const DATA = new URL('../data/tourapi_jeju_festivals_ko.json', import.meta.url);

const toEvent = (item) => ({
  id: item.contentid,
  title: item.title,
  start: item.eventstartdate,
  end: item.eventenddate,
  address: [item.addr1, item.addr2].filter(Boolean).join(' '),
  tel: item.tel ?? '',
  photo: item.firstimage || null,
  lat: Number(item.mapy) || null,
  lng: Number(item.mapx) || null,
});

async function handle(req, res) {
  try {
    const events = JSON.parse(await readFile(DATA, 'utf8')).map(toEvent);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(events));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`행사 데이터를 읽지 못했습니다 (node scripts/check-tourapi.mjs 로 받기): ${err.code ?? err.message}`);
  }
}

export default function eventsApi() {
  const use = (server) => {
    server.middlewares.use('/api/events', handle);
  };
  return { name: 'events-api', configureServer: use, configurePreviewServer: use };
}
