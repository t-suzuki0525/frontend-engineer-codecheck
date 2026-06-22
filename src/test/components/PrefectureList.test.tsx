import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefectureList } from '@/components/PrefectureList/PrefectureList';

const prefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
];

describe('PrefectureList', () => {
  it('すべての都道府県名が表示される', () => {
    render(<PrefectureList prefectures={prefectures} selectedPrefCodes={new Set()} onToggle={vi.fn()} />);
    expect(screen.getByText('北海道')).toBeInTheDocument();
    expect(screen.getByText('東京都')).toBeInTheDocument();
  });

  it('selectedPrefCodes に含まれる都道府県のチェックボックスがチェック済みになる', () => {
    render(
      <PrefectureList prefectures={prefectures} selectedPrefCodes={new Set([1])} onToggle={vi.fn()} />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('チェックボックスを操作すると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn();
    render(<PrefectureList prefectures={prefectures} selectedPrefCodes={new Set()} onToggle={onToggle} />);
    await userEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onToggle).toHaveBeenCalledWith(1, true);
  });

  it('都道府県が空のとき、チェックボックスが表示されない', () => {
    render(<PrefectureList prefectures={[]} selectedPrefCodes={new Set()} onToggle={vi.fn()} />);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });
});
