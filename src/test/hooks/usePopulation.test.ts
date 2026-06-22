import { renderHook, waitFor } from '@testing-library/react';
import { apiClient } from '@/api/config';
import { usePopulation } from '@/hooks/usePopulation';

vi.mock('@/api/config', () => ({
  apiClient: { get: vi.fn() },
}));

afterEach(() => {
  vi.clearAllMocks();
});

const mockPopulationData = {
  boundaryYear: 2020,
  data: [
    {
      label: '総人口',
      data: [{ year: 2020, value: 5000000 }],
    },
  ],
};

describe('usePopulation', () => {
  it('初期状態で空の Map と loading=false を返す', () => {
    // Set をコールバック外で生成し、レンダーをまたいで参照を安定させる
    const emptyCodes = new Set<number>();
    const { result } = renderHook(() => usePopulation(emptyCodes));
    expect(result.current.populationData.size).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('都道府県を選択すると人口データを取得して Map に格納する', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: mockPopulationData } });

    // Set をコールバック外で生成し、レンダーをまたいで参照を安定させる
    const codes = new Set([1]);
    const { result } = renderHook(() => usePopulation(codes));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.populationData.get(1)).toEqual(mockPopulationData);
  });

  it('一度取得した都道府県を再選択しても API は追加で呼ばれない（キャッシュ）', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: mockPopulationData } });

    const { result, rerender } = renderHook(
      ({ codes }: { codes: Set<number> }) => usePopulation(codes),
      { initialProps: { codes: new Set([1]) } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(vi.mocked(apiClient.get)).toHaveBeenCalledTimes(1);

    // チェックを外してから再チェック
    rerender({ codes: new Set<number>() });
    rerender({ codes: new Set([1]) });

    await waitFor(() => expect(result.current.populationData.has(1)).toBe(true));
    // キャッシュが効いているので API 呼び出し回数は増えない
    expect(vi.mocked(apiClient.get)).toHaveBeenCalledTimes(1);
  });

  it('都道府県の選択を解除すると populationData から除外される', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: mockPopulationData } });

    const { result, rerender } = renderHook(
      ({ codes }: { codes: Set<number> }) => usePopulation(codes),
      { initialProps: { codes: new Set([1]) } }
    );
    await waitFor(() => expect(result.current.populationData.has(1)).toBe(true));

    rerender({ codes: new Set<number>() });
    expect(result.current.populationData.has(1)).toBe(false);
  });

  it('API エラー時に error を返す', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('API Error'));

    // Set をコールバック外で生成し、レンダーをまたいで参照を安定させる
    const codes = new Set([1]);
    const { result } = renderHook(() => usePopulation(codes));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
