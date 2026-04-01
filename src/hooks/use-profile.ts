import { useCallback } from 'react';

import { profileService } from '@/services/profile.service';

import { useAsyncData } from './use-async-data';

export function useProfile() {
  const loader = useCallback(() => profileService.getProfile(), []);
  return useAsyncData(loader);
}
