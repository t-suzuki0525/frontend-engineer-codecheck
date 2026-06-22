import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrefectureCheckbox } from '@/components/PrefectureList/PrefectureCheckbox';

const mockPrefecture = { prefCode: 1, prefName: '北海道' };

describe('PrefectureCheckbox', () => {
  it('都道府県名が表示される', () => {
    render(<PrefectureCheckbox prefecture={mockPrefecture} checked={false} onChange={vi.fn()} />);
    expect(screen.getByText('北海道')).toBeInTheDocument();
  });

  it('checked=true のとき、チェックボックスがチェック済みになる', () => {
    render(<PrefectureCheckbox prefecture={mockPrefecture} checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('checked=false のとき、チェックボックスが未チェックになる', () => {
    render(<PrefectureCheckbox prefecture={mockPrefecture} checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('チェックすると onChange が prefCode と true で呼ばれる', async () => {
    const onChange = vi.fn();
    render(<PrefectureCheckbox prefecture={mockPrefecture} checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(1, true);
  });

  it('チェックを外すと onChange が prefCode と false で呼ばれる', async () => {
    const onChange = vi.fn();
    render(<PrefectureCheckbox prefecture={mockPrefecture} checked={true} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(1, false);
  });
});
