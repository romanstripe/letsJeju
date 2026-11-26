import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import placesApi from './server/placesApi.js';
import eventsApi from './server/eventsApi.js';

export default defineConfig({
  plugins: [react(), placesApi(), eventsApi()],
  // 카카오에 등록한 도메인이 localhost:5173 이라 포트를 고정한다.
  // 이미 쓰는 중이면 다른 포트로 넘어가지 않고 에러를 낸다.
  server: { port: 5173, strictPort: true },
});
