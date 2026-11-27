import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import placesApi from './server/placesApi.js';
import eventsApi from './server/eventsApi.js';
import translateApi from './server/translateApi.js';

export default defineConfig(({ mode }) => {
  // VITE_ 가 아닌 키는 서버에서만 쓴다. 화면 코드에는 들어가지 않는다.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), placesApi(), eventsApi(), translateApi({ key: env.GOOGLE_TRANSLATE_KEY || env.GOOGLE_TTS_KEY })],
    // 카카오에 등록한 도메인이 localhost:5173 이라 포트를 고정한다.
    // 이미 쓰는 중이면 다른 포트로 넘어가지 않고 에러를 낸다.
    server: { port: 5173, strictPort: true },
  };
});
