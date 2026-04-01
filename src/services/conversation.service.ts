import { CONVERSATION_DATA } from '@/data/mock-data';

import { delay } from './helpers';

export const conversationService = {
  async getConversation() {
    await delay(300);
    return CONVERSATION_DATA;
  },
};
