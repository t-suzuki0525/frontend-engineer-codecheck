import type { Prefecture } from '@/types';
import styles from './PrefectureCheckbox.module.css';

type Props = {
  prefecture: Prefecture;
  checked: boolean;
  onChange: (prefCode: number, checked: boolean) => void;
};

/**
 * 都道府県1件のチェックボックス
 * @param props.prefecture 表示する都道府県
 * @param props.checked チェック状態
 * @param props.onChange チェック状態が変化したときのコールバック
 */
export const PrefectureCheckbox = ({ prefecture, checked, onChange }: Props) => {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(prefecture.prefCode, e.target.checked)}
      />
      {prefecture.prefName}
    </label>
  );
}
