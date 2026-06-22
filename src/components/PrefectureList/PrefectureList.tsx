import type { Prefecture } from '@/types';
import { PrefectureCheckbox } from './PrefectureCheckbox';
import styles from './PrefectureList.module.css';

type Props = {
  prefectures: Prefecture[];
  selectedPrefCodes: Set<number>;
  onToggle: (prefCode: number, checked: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

/**
 * 都道府県一覧のチェックボックスグループ
 * @param props.prefectures 都道府県一覧
 * @param props.selectedPrefCodes 選択中の都道府県コードのSet
 * @param props.onToggle チェック状態が変化したときのコールバック
 * @param props.onSelectAll 全都道府県を選択するコールバック
 * @param props.onClearAll 全都道府県の選択を解除するコールバック
 */
export const PrefectureList = ({ prefectures, selectedPrefCodes, onToggle, onSelectAll, onClearAll }: Props) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>都道府県</h2>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={onSelectAll}>
            全選択
          </button>
          <button type="button" className={styles.actionButton} onClick={onClearAll}>
            全解除
          </button>
        </div>
      </div>
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
