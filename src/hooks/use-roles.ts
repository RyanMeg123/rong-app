import { useCallback } from 'react';

import { rolesService } from '@/services/roles.service';

import { useAsyncData } from './use-async-data';

export function useRoles() {
  const loader = useCallback(() => rolesService.getRoles(), []);
  return useAsyncData(loader);
}
