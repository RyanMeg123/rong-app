import { useCallback } from 'react';

import { memoryService } from '@/services/memory.service';

import { useAsyncData } from './use-async-data';

export function useMemories() {
  const loader = useCallback(() => memoryService.getMemories(), []);
  return useAsyncData(loader);
}
