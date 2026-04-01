import { HOME_DATA } from '@/data/mock-data';

import { delay } from './helpers';

export const homeService = {
  async getHome() {
    await delay(350);
    return HOME_DATA;
  },
};
