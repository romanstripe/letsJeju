// 개발/미리보기 서버의 /api/translate. Google Cloud Translation(v2)을 대신 부른다.
// 키는 여기(서버)에서만 쓴다. 배포용 서버 함수(api/)는 아직 없다.
const LANGS = new Set(['ko', 'en', 'ja', 'zh-CN', 'zh-TW']);
const MAX_TEXT = 500;
const MAX_BODY = 4000;

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let body = '';
  req.setEncoding('utf8');
  for await (const chunk of req) {
    body += chunk;
    if (body.length > MAX_BODY) throw new Error('too large');
  }
  return JSON.parse(body);
}

async function handle(key, req, res) {
  // JSON 만 받는다 (다른 사이트의 단순 폼 요청을 막는다)
  if (req.method !== 'POST' || !String(req.headers['content-type']).startsWith('application/json')) {
    return send(res, 405, { error: 'POST application/json only' });
  }
  let input;
  try {
    input = await readBody(req);
  } catch {
    return send(res, 400, { error: 'bad request' });
  }
  const { text, source, target } = input ?? {};
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT || !LANGS.has(source) || !LANGS.has(target)) {
    return send(res, 400, { error: 'bad request' });
  }
  if (!key) {
    console.error('.env.local 에 GOOGLE_TRANSLATE_KEY 또는 GOOGLE_TTS_KEY 가 없습니다.');
    return send(res, 503, { error: 'no key' });
  }
  try {
    // 키는 URL 이 아니라 헤더로 보낸다
    const reply = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: { 'X-Goog-Api-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source, target, format: 'text' }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await reply.json();
    if (!reply.ok) {
      console.error(`번역 API HTTP ${reply.status}: ${data.error?.message}`);
      return send(res, 502, { error: 'translate failed', status: reply.status });
    }
    return send(res, 200, { text: data.data.translations[0].translatedText });
  } catch (err) {
    console.error(`번역 API 호출 실패: ${err.message}`);
    return send(res, 502, { error: 'translate failed' });
  }
}

export default function translateApi({ key } = {}) {
  const use = (server) => {
    server.middlewares.use('/api/translate', (req, res) => handle(key, req, res));
  };
  return { name: 'translate-api', configureServer: use, configurePreviewServer: use };
}
