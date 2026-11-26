import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import placesApi from './server/placesApi.js';

export default defineConfig({
  plugins: [react(), placesApi()],
});
