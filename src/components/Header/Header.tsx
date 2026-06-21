import styles from './Header.module.css';

/** ページタイトルを表示するヘッダー */
export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>都道府県別の総人口推移グラフ</h1>
    </header>
  );
}
