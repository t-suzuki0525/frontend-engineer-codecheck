import axios from 'axios';

// 開発時はViteプロキシ、本番時はVercelリライトを経由するため相対パスで統一する
const BASE_URL = '';
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
