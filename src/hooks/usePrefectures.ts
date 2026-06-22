import { useEffect, useState } from 'react';
import { fetchPrefectures } from '@/api/prefectures';
import type { Prefecture } from '@/types';

type State = {
  prefectures: Prefecture[];
  loading: boolean;
  error: Error | null;
};

/** 都道府県一覧を取得し、ローディング・エラー状態を管理するフック */
export const usePrefectures = (): State => {
  const [state, setState] = useState<State>({
    prefectures: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // StrictModeの二重呼び出しやコンポーネントのアンマウント時に
    // 非同期処理の結果で setState が呼ばれないよう、キャンセルフラグで制御する
    let cancelled = false;

    fetchPrefectures()
      .then((prefectures) => {
        if (!cancelled) {
          setState({ prefectures, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            prefectures: [],
            loading: false,
            // fetch が Error 以外をthrowした場合も Error に統一する
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      });

    // クリーンアップ関数でフラグを立て、レスポンス後の setState を無効化する
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
