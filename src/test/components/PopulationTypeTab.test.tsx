import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopulationTypeTab } from '@/components/PopulationTypeTab/PopulationTypeTab';

describe('PopulationTypeTab', () => {
  it('4つの人口種別タブがすべて表示される', () => {
    render(<PopulationTypeTab activeLabel="総人口" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '総人口' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '年少人口' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '生産年齢人口' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '老年人口' })).toBeInTheDocument();
  });

  it('activeLabel に対応するタブが aria-selected=true になる', () => {
    render(<PopulationTypeTab activeLabel="年少人口" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '年少人口' })).toHaveAttribute('aria-selected', 'true');
  });

  it('activeLabel 以外のタブは aria-selected=false になる', () => {
    render(<PopulationTypeTab activeLabel="総人口" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '年少人口' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '生産年齢人口' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '老年人口' })).toHaveAttribute('aria-selected', 'false');
  });

  it('タブをクリックすると onChange が選択した種別で呼ばれる', async () => {
    const onChange = vi.fn();
    render(<PopulationTypeTab activeLabel="総人口" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: '老年人口' }));
    expect(onChange).toHaveBeenCalledWith('老年人口');
  });
});
