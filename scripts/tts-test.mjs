// 구글 Text-to-Speech 목소리 시험용. 실행: node scripts/tts-test.mjs
// .env.local 의 GOOGLE_TTS_KEY 를 읽어 audio-test/<female|male>/ 에 mp3 를 저장한다.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const OUT = new URL('audio-test/', ROOT);
const API = 'https://texttospeech.googleapis.com/v1';
const LANG = 'ko-KR';
const SPEAKING_RATE = 0.95;
const FAMILIES = ['Chirp3-HD', 'Neural2']; // 앞에 있는 계열을 먼저 쓴다

const TEXTS = {
  prefix_right: '오른쪽 창밖을 보세요.',
  prefix_left: '왼쪽 창밖을 보세요.',
  body_seongsan:
    '성산일출봉이에요. 약 5천 년 전, 바닷속에서 화산이 터지면서 생겼어요. 그래서 2007년에 유네스코 세계자연유산이 됐죠. 정상까지는 걸어서 20분쯤인데, 이름처럼 해 뜰 때가 제일 예뻐요.',
};

process.loadEnvFile(fileURLToPath(new URL('.env.local', ROOT)));
const KEY = process.env.GOOGLE_TTS_KEY;
if (!KEY) {
  console.error('.env.local 에 GOOGLE_TTS_KEY 가 없어요.');
  process.exit(1);
}

// 키는 URL 이 아니라 헤더로 보낸다. 실패하면 응답을 그대로 담아 던진다.
async function call(path, body) {
  const res = await fetch(`${API}/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'X-Goog-Api-Key': KEY, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} (${path})\n${text}`);
  return JSON.parse(text);
}

function pickVoice(voices, gender) {
  for (const family of FAMILIES) {
    const found = voices
      .filter((v) => v.ssmlGender === gender && v.name.includes(family))
      .sort((a, b) => a.name.localeCompare(b.name))[0];
    if (found) return found.name;
  }
  throw new Error(`${LANG} ${gender} 목소리를 찾지 못했어요 (${FAMILIES.join(', ')}).`);
}

try {
  const { voices = [] } = await call(`voices?languageCode=${LANG}`);

  for (const gender of ['FEMALE', 'MALE']) {
    const name = pickVoice(voices, gender);
    const dir = new URL(`${gender.toLowerCase()}/`, OUT);
    await mkdir(dir, { recursive: true });
    console.log(`\n[${gender}] ${name}`);

    for (const [file, text] of Object.entries(TEXTS)) {
      const { audioContent } = await call('text:synthesize', {
        input: { text },
        voice: { languageCode: LANG, name },
        audioConfig: { audioEncoding: 'MP3', speakingRate: SPEAKING_RATE },
      });
      const buf = Buffer.from(audioContent, 'base64');
      await writeFile(new URL(`${file}.mp3`, dir), buf);
      console.log(`  audio-test/${gender.toLowerCase()}/${file}.mp3  (${buf.length} bytes)`);
    }
  }
} catch (err) {
  console.error(err.message);
  if (err.cause) console.error(err.cause);
  process.exitCode = 1;
}
