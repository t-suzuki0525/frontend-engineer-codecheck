import type { PopulationLabel } from '@/types';
import styles from './PopulationTypeTab.module.css';

const LABELS: PopulationLabel[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];

type Props = {
  activeLabel: PopulationLabel;
  onChange: (label: PopulationLabel) => void;
};

/**
 * 人口種別（総人口・年少人口・生産年齢人口・老年人口）を切り替えるタブ
 * @param props.activeLabel 現在選択中の人口種別
 * @param props.onChange 人口種別が切り替わったときのコールバック
 */
export const PopulationTypeTab = ({ activeLabel, onChange }: Props) => {
  return (
    <div className={styles.tabs} role="tablist" aria-label="人口種別">
      {LABELS.map((label) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={activeLabel === label}
          className={`${styles.tab} ${activeLabel === label ? styles.active : ''}`}
          onClick={() => onChange(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
