import axios from 'axios';

// 開発時はViteプロキシ経由（相対パス）、本番時は直接APIを呼ぶ
const BASE_URL = import.meta.env.DEV
  ? ''
  : 'https://frontend-engineer-codecheck-api.mirai.yumemi.io';
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * RESAS APIのaxiosインスタンス
 * baseURLとAPIキーヘッダーをデフォルト設定として持つ
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
  },
});
