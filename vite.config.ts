import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    // X-API-KEY カスタムヘッダーによるCORSプリフライトを回避するためプロキシを使用する
    proxy: {
      '/api': {
        target: 'https://frontend-engineer-codecheck-api.mirai.yumemi.io',
        changeOrigin: true,
      },
    },
  },
});
