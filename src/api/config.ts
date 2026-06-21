import axios from 'axios';

const BASE_URL = 'https://frontend-engineer-codecheck-api.mirai.yumemi.io';
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
