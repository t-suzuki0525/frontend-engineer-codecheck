import { render, screen } from '@testing-library/react';
import { act } from 'react';
import App from '@/App';

// axiosインスタンスをモックしてAPIコールを防ぐ
vi.mock('@/api/config', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: { message: null, result: [] } }),
  },
}));

describe('App', () => {
  it('ヘッダーのタイトルが表示される', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('都道府県別の総人口推移グラフ')).toBeInTheDocument();
  });

  it('都道府県が選択されていない場合、グラフの空状態が表示される', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('都道府県を選択するとグラフが表示されます')).toBeInTheDocument();
  });
});
