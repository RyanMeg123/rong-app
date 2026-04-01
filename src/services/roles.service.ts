import { ROLE_OPTIONS } from '@/data/mock-data';

import { delay } from './helpers';

export const rolesService = {
  async getRoles() {
    await delay(250);
    return ROLE_OPTIONS;
  },
};
