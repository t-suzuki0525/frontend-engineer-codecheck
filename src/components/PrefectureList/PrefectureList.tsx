import type { Prefecture } from '@/types';
import { PrefectureCheckbox } from './PrefectureCheckbox';
import styles from './PrefectureList.module.css';

type Props = {
  prefectures: Prefecture[];
  selectedPrefCodes: Set<number>;
  onToggle: (prefCode: number, checked: boolean) => void;
};

/**
 * 都道府県一覧のチェックボックスグループ
 * @param props.prefectures 都道府県一覧
 * @param props.selectedPrefCodes 選択中の都道府県コードのSet
 * @param props.onToggle チェック状態が変化したときのコールバック
 */
export const PrefectureList = ({ prefectures, selectedPrefCodes, onToggle }: Props) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>都道府県</h2>
      <div className={styles.grid}>
        {prefectures.map((pref) => (
          <PrefectureCheckbox
            key={pref.prefCode}
            prefecture={pref}
            checked={selectedPrefCodes.has(pref.prefCode)}
            onChange={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
