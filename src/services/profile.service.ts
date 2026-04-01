import { PROFILE_DATA } from '@/data/mock-data';

import { delay } from './helpers';

export const profileService = {
  async getProfile() {
    await delay(280);
    return PROFILE_DATA;
  },
};
