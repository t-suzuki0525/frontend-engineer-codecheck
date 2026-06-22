import { useEffect, useRef, useState } from 'react';
import { fetchPopulation } from '@/api/population';
import type { PopulationResponse } from '@/types';

type PopulationCache = Map<number, PopulationResponse>;

type State = {
  populationData: PopulationCache;
  loading: boolean;
  error: Error | null;
};

/**
 * 選択された都道府県の人口データを取得・キャッシュするフック
 * 取得済みの都道府県コードはrefでキャッシュされ、チェックのたびに重複リクエストが走らない
 * @param selectedPrefCodes 選択中の都道府県コードのSet
 */
export const usePopulation = (selectedPrefCodes: Set<number>): State => {
  const [populationData, setPopulationData] = useState<PopulationCache>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<PopulationCache>(new Map());

  useEffect(() => {
    // selectedPrefCodes が変化するたびに、キャッシュに存在しないコードだけを抽出する
    const uncachedCodes = [...selectedPrefCodes].filter((code) => !cache.current.has(code));

    // チェックボックス操作のたびにキャッシュ済みデータを即時反映する
    // これにより、新しい都道府県の取得中でも既存のグラフ表示が維持される
    setPopulationData(
      new Map([...cache.current].filter(([code]) => selectedPrefCodes.has(code)))
    );

    // すべて取得済みであれば API リクエストは不要
    if (uncachedCodes.length === 0) return;

    setLoading(true);

    // 未取得の都道府県を並列リクエストで一括取得する
    Promise.all(uncachedCodes.map((code) => fetchPopulation(code).then((data) => ({ code, data }))))
      .then((results) => {
        // 取得結果をすべてキャッシュに追記する
        for (const { code, data } of results) {
          cache.current.set(code, data);
        }
        // キャッシュから現在の選択状態に合わせてフィルタして反映する
        setPopulationData(
          new Map([...cache.current].filter(([code]) => selectedPrefCodes.has(code)))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [selectedPrefCodes]);

  return { populationData, loading, error };
}
