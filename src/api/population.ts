import type { PopulationResponse } from '@/types';
import { apiClient } from './config';

type PopulationApiResponse = {
  message: string | null;
  result: PopulationResponse;
};

/**
 * 都道府県の人口構成データを取得する
 * @param prefCode 都道府県コード
 */
export const fetchPopulation = async (prefCode: number): Promise<PopulationResponse> => {
  const { data } = await apiClient.get<PopulationApiResponse>(
    '/api/v1/population/composition/perYear',
    { params: { prefCode } }
  );
  return data.result;
};
