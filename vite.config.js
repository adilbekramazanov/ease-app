import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// viteSingleFile → один self-contained dist/index.html для демонстрации
// (двойной клик / отправить ссылку). `npm run dev` работает как обычно.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: { allowedHosts: true },
});
