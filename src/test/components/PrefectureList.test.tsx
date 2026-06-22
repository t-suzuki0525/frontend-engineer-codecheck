import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefectureList } from '@/components/PrefectureList/PrefectureList';

const prefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
];

const defaultProps = {
  prefectures,
  selectedPrefCodes: new Set<number>(),
  onToggle: vi.fn(),
  onSelectAll: vi.fn(),
  onClearAll: vi.fn(),
};

describe('PrefectureList', () => {
  it('すべての都道府県名が表示される', () => {
    render(<PrefectureList {...defaultProps} />);
    expect(screen.getByText('北海道')).toBeInTheDocument();
    expect(screen.getByText('東京都')).toBeInTheDocument();
  });

  it('selectedPrefCodes に含まれる都道府県のチェックボックスがチェック済みになる', () => {
    render(<PrefectureList {...defaultProps} selectedPrefCodes={new Set([1])} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('チェックボックスを操作すると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn();
    render(<PrefectureList {...defaultProps} onToggle={onToggle} />);
    await userEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onToggle).toHaveBeenCalledWith(1, true);
  });

  it('都道府県が空のとき、チェックボックスが表示されない', () => {
    render(<PrefectureList {...defaultProps} prefectures={[]} />);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('全選択ボタンをクリックすると onSelectAll が呼ばれる', async () => {
    const onSelectAll = vi.fn();
    render(<PrefectureList {...defaultProps} onSelectAll={onSelectAll} />);
    await userEvent.click(screen.getByRole('button', { name: '全選択' }));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it('全解除ボタンをクリックすると onClearAll が呼ばれる', async () => {
    const onClearAll = vi.fn();
    render(<PrefectureList {...defaultProps} selectedPrefCodes={new Set([1, 13])} onClearAll={onClearAll} />);
    await userEvent.click(screen.getByRole('button', { name: '全解除' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
