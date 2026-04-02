import { useCallback, useMemo } from 'react';

import { HOME_DATA } from '@/data/mock-data';

export function useHome() {
  const reload = useCallback(async () => {}, []);

  return useMemo(
    () => ({
      data: HOME_DATA,
      error: null,
      isLoading: false,
      reload,
    }),
    [reload],
  );
}
