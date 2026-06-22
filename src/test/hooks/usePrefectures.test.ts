import { renderHook, waitFor } from '@testing-library/react';
import { apiClient } from '@/api/config';
import { usePrefectures } from '@/hooks/usePrefectures';

vi.mock('@/api/config', () => ({
  apiClient: { get: vi.fn() },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('usePrefectures', () => {
  it('初期状態で loading=true、prefectures=[] を返す', () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: [] } });
    const { result } = renderHook(() => usePrefectures());
    expect(result.current.loading).toBe(true);
    expect(result.current.prefectures).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('取得成功時に都道府県一覧を返し、loading=false になる', async () => {
    const prefectures = [{ prefCode: 1, prefName: '北海道' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: prefectures } });

    const { result } = renderHook(() => usePrefectures());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.prefectures).toEqual(prefectures);
    expect(result.current.error).toBeNull();
  });

  it('取得失敗時に error を返し、prefectures=[] のまま', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => usePrefectures());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.prefectures).toEqual([]);
  });

  it('マウント時に1回だけ API を呼ぶ', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { message: null, result: [] } });

    renderHook(() => usePrefectures());
    await waitFor(() => expect(vi.mocked(apiClient.get)).toHaveBeenCalledTimes(1));
  });
});
