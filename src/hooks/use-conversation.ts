import { useCallback } from 'react';

import { conversationService } from '@/services/conversation.service';

import { useAsyncData } from './use-async-data';

export function useConversation() {
  const loader = useCallback(() => conversationService.getConversation(), []);
  return useAsyncData(loader);
}
