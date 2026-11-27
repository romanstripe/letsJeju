// audio-test/tts_scripts.md 의 원고를 mp3 로 만들어 public/audio/ 에 저장한다 (제목은 읽지 않음).
// 실행: node scripts/tts-narration.mjs
// 파일이 이미 있어도 다시 만들어 덮어쓴다.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const OUT = new URL('public/audio/', ROOT);
const VOICE = 'ko-KR-Chirp3-HD-Achernar';
const SPEAKING_RATE = 0.95;
// 원고의 번호 순서와 같은 파일 이름
const FILES = [
  'yongduam', 'seopjikoji', 'seongsan', 'soesokkak', 'jeongbang',
  'jusangjeolli', 'sanbangsan', 'yongmeori', 'suwolbong', 'sangumburi',
];

process.loadEnvFile(fileURLToPath(new URL('.env.local', ROOT)));
const KEY = process.env.GOOGLE_TTS_KEY;
if (!KEY) {
  console.error('.env.local 에 GOOGLE_TTS_KEY 가 없어요.');
  process.exit(1);
}

// "1. 용두암" 다음의 들여쓴 줄이 읽을 문단
const source = await readFile(new URL('audio-test/tts_scripts.md', ROOT), 'utf8');
const scripts = [...source.matchAll(/^(\d+)\. (.+)\r?\n((?:[ \t]+.+(?:\r?\n|$))+)/gm)].map((m) => ({
  number: Number(m[1]),
  title: m[2].trim(),
  text: m[3].split('\n').map((line) => line.trim()).filter(Boolean).join(' '),
}));
if (scripts.length !== FILES.length) {
  console.error(`원고 ${scripts.length}개를 읽었는데 파일 이름은 ${FILES.length}개예요.`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
for (const { number, title, text } of scripts) {
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: { 'X-Goog-Api-Key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'ko-KR', name: VOICE },
      audioConfig: { audioEncoding: 'MP3', speakingRate: SPEAKING_RATE },
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText} (${title})\n${body}`);
    process.exit(1);
  }
  const buf = Buffer.from(JSON.parse(body).audioContent, 'base64');
  const file = `${String(number).padStart(2, '0')}_${FILES[number - 1]}.mp3`;
  await writeFile(new URL(file, OUT), buf);
  console.log(`public/audio/${file}  ${title}  글자 ${text.length}  ${buf.length} bytes`);
}
