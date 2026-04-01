import { useCallback } from 'react';

import { homeService } from '@/services/home.service';

import { useAsyncData } from './use-async-data';

export function useHome() {
  const loader = useCallback(() => homeService.getHome(), []);
  return useAsyncData(loader);
}
