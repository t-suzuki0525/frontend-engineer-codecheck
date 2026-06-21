import type { Prefecture } from '@/types';
import { apiClient } from './config';

type PrefecturesApiResponse = {
  message: string | null;
  result: Prefecture[];
};

/** 都道府県一覧を取得する */
export const fetchPrefectures = async (): Promise<Prefecture[]> => {
  const { data } = await apiClient.get<PrefecturesApiResponse>('/api/v1/prefectures');
  return data.result;
};
