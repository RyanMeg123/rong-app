import { MEMORIES_DATA } from '@/data/mock-data';

import { delay } from './helpers';

export const memoryService = {
  async getMemories() {
    await delay(320);
    return MEMORIES_DATA;
  },
};
