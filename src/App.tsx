import { useCallback, useState } from 'react';
import { Header } from '@/components/Header/Header';
import { PopulationGraph } from '@/components/PopulationGraph/PopulationGraph';
import { PopulationTypeTab } from '@/components/PopulationTypeTab/PopulationTypeTab';
import { PrefectureList } from '@/components/PrefectureList/PrefectureList';
import { usePopulation } from '@/hooks/usePopulation';
import { usePrefectures } from '@/hooks/usePrefectures';
import type { PopulationLabel } from '@/types';
import '@/styles/global.css';
import styles from './App.module.css';

const App = () => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<Set<number>>(new Set());
  const [activeLabel, setActiveLabel] = useState<PopulationLabel>('総人口');

  const { prefectures, loading: prefLoading, error: prefError } = usePrefectures();
  const { populationData, loading: popLoading, error: popError } = usePopulation(selectedPrefCodes);

  const handleToggle = useCallback((prefCode: number, checked: boolean) => {
    setSelectedPrefCodes((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(prefCode);
      } else {
        next.delete(prefCode);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedPrefCodes(new Set(prefectures.map((p) => p.prefCode)));
  }, [prefectures]);

  const handleClearAll = useCallback(() => {
    setSelectedPrefCodes(new Set());
  }, []);

  const selectedPrefectures = prefectures.filter((p) => selectedPrefCodes.has(p.prefCode));

  return (
    <>
      <Header />
      <main className={styles.main}>
        {prefError && (
          <p className={styles.error}>都道府県一覧の取得に失敗しました: {prefError.message}</p>
        )}
        {prefLoading ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : (
          <PrefectureList
            prefectures={prefectures}
            selectedPrefCodes={selectedPrefCodes}
            onToggle={handleToggle}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        )}
        {popError && (
          <p className={styles.error}>人口データの取得に失敗しました: {popError.message}</p>
        )}
        <PopulationTypeTab activeLabel={activeLabel} onChange={setActiveLabel} />
        <PopulationGraph
          populationData={populationData}
          selectedPrefectures={selectedPrefectures}
          activeLabel={activeLabel}
          loading={popLoading}
        />
      </main>
    </>
  );
}

export default App;
