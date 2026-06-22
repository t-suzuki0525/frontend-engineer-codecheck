import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PopulationLabel, PopulationResponse, Prefecture } from '@/types';
import styles from './PopulationGraph.module.css';

/**
 * 人口数を日本語単位（万・億）で整形する
 * @param value 人口数
 */
const formatPopulation = (value: number): string => {
  if (value >= 1_0000_0000) {
    return `${(value / 1_0000_0000).toLocaleString()}億`;
  }
  if (value >= 1_0000) {
    return `${(value / 1_0000).toLocaleString()}万`;
  }
  return value.toLocaleString();
};

const LINE_COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed',
  '#db2777', '#0891b2', '#65a30d', '#ea580c', '#6366f1',
  '#0f766e', '#b45309', '#9333ea', '#0284c7', '#15803d',
  '#f43f5e', // ローズ（赤・ピンクと色相が異なる）
  '#0ea5e9', // スカイブルー（既存の青系より明るい）
];

// 色数（17）× パターン数（3）= 51通りで全47都道府県を重複なしにカバーする
const LINE_DASH_PATTERNS = [
  undefined, // 実線
  '8 4',     // 破線
  '2 4',     // 点線
];

type ChartDataPoint = { year: number } & Record<string, number>;

/** ツールチップに一度に表示する都道府県の最大件数 */
const MAX_TOOLTIP_ITEMS = 10;

type TooltipEntry = {
  dataKey?: unknown;
  value?: unknown;
  color?: string;
};

type NarrowedEntry = {
  dataKey: string;
  value: number;
  color: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: string | number;
  selectedPrefectures: Prefecture[];
};

/**
 * 人口値の降順で上位10件を表示し、超過分は「他N県」と表示するツールチップ
 * @param props.active ツールチップが表示中かどうか
 * @param props.payload ホバー中の年の各都道府県データ
 * @param props.label ホバー中の年
 * @param props.selectedPrefectures 選択中の都道府県一覧（表示名の解決に使用）
 */
const CustomTooltip = ({ active, payload, label, selectedPrefectures }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  // dataKey が string、value が number のエントリのみを絞り込む
  const narrowed: NarrowedEntry[] = payload
    .filter((e): e is { dataKey: string; value: number; color?: string } =>
      typeof e.dataKey === 'string' && typeof e.value === 'number'
    )
    .map((e) => ({ dataKey: e.dataKey, value: e.value, color: e.color ?? '#6b7280' }));

  // 人口値の降順にソートし、上位MAX_TOOLTIP_ITEMS件を表示する
  const sorted = [...narrowed].sort((a, b) => b.value - a.value);
  const visible = sorted.slice(0, MAX_TOOLTIP_ITEMS);
  const hiddenCount = sorted.length - visible.length;

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '10px 14px',
      fontSize: '0.8125rem',
    }}>
      <p style={{ marginBottom: '6px', fontWeight: 600 }}>{label}年</p>
      {visible.map((entry) => {
        const pref = selectedPrefectures.find((p) => String(p.prefCode) === entry.dataKey);
        return (
          <p key={entry.dataKey} style={{ color: entry.color, margin: '2px 0' }}>
            {pref?.prefName ?? entry.dataKey}: {formatPopulation(entry.value)}
          </p>
        );
      })}
      {hiddenCount > 0 && (
        <p style={{ color: '#9ca3af', marginTop: '6px', fontSize: '0.75rem' }}>
          他{hiddenCount}県
        </p>
      )}
    </div>
  );
};

/**
 * Rechartsが受け取る形式にデータを変換する
 * 各要素は `{ year, [prefCode]: value }` の形式
 * @param populationData 都道府県コードをキーとした人口データのMap
 * @param activeLabel 表示対象の人口種別
 */
const buildChartData = (
  populationData: Map<number, PopulationResponse>,
  activeLabel: PopulationLabel
): ChartDataPoint[] => {
  if (populationData.size === 0) return [];

  // 年のリストは最初の都道府県から取得する（全都道府県で共通の年系列を前提とする）
  const firstEntry = [...populationData.values()][0];
  const baseCategory = firstEntry.data.find((d) => d.label === activeLabel);
  if (!baseCategory) return [];

  return baseCategory.data.map(({ year }) => {
    // dataKey を prefCode の文字列にすることで、Line コンポーネントと対応させる
    const point: ChartDataPoint = { year };
    for (const [prefCode, response] of populationData) {
      const category = response.data.find((d) => d.label === activeLabel);
      const dataPoint = category?.data.find((d) => d.year === year);
      if (dataPoint) {
        point[String(prefCode)] = dataPoint.value;
      }
    }
    return point;
  });
}

type Props = {
  populationData: Map<number, PopulationResponse>;
  selectedPrefectures: Prefecture[];
  activeLabel: PopulationLabel;
  loading: boolean;
};

/**
 * 選択された都道府県の人口推移を折れ線グラフで表示する
 * @param props.populationData 都道府県コードをキーとした人口データのMap
 * @param props.selectedPrefectures 選択中の都道府県一覧（凡例・ツールチップの表示名に使用）
 * @param props.activeLabel 表示対象の人口種別
 * @param props.loading 追加データ取得中かどうか
 */
export const PopulationGraph = ({ populationData, selectedPrefectures, activeLabel, loading }: Props) => {
  if (selectedPrefectures.length === 0) {
    return (
      <div className={styles.empty}>
        <p>都道府県を選択するとグラフが表示されます</p>
      </div>
    );
  }

  const chartData = buildChartData(populationData, activeLabel);

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={560}>
        <LineChart data={chartData} margin={{ top: 40, right: 24, left: 16, bottom: 36 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tickFormatter={(v: number) => String(v)}
            tick={{ fontSize: 12 }}
            label={{ value: '年度', position: 'insideBottomRight', offset: -8, fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v: number) => formatPopulation(v)}
            tick={{ fontSize: 12 }}
            width={80}
            domain={['auto', 'auto']}
            label={{ value: '人口数', position: 'insideTopLeft', dy: -32, fontSize: 12 }}
          />
          <Tooltip
            wrapperStyle={{ zIndex: 10 }}
            content={(props) => (
              <CustomTooltip
                {...props}
                selectedPrefectures={selectedPrefectures}
              />
            )}
          />
          {selectedPrefectures.map((pref, i) => (
            <Line
              key={pref.prefCode}
              type="monotone"
              // dataKey を prefCode 文字列にすることで buildChartData の出力と対応させる
              dataKey={String(pref.prefCode)}
              name={String(pref.prefCode)}
              stroke={LINE_COLORS[i % LINE_COLORS.length]}
              // 色が一巡するごとにダッシュパターンを切り替え、最大45通りの組み合わせを生成する
              strokeDasharray={LINE_DASH_PATTERNS[Math.floor(i / LINE_COLORS.length)]}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Rechartsのlegendをグラフ外に出すことで、モバイルでの凡例とグラフの重なりを防ぐ */}
      <div className={styles.legend}>
        {selectedPrefectures.map((pref, i) => (
          <span key={pref.prefCode} className={styles.legendItem}>
            <svg width="24" height="12" aria-hidden="true">
              <line
                x1="0" y1="6" x2="24" y2="6"
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth="2"
                strokeDasharray={LINE_DASH_PATTERNS[Math.floor(i / LINE_COLORS.length)]}
              />
            </svg>
            {pref.prefName}
          </span>
        ))}
      </div>
    </div>
  );
}
