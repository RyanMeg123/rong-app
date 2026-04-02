import { Redirect } from 'expo-router';

import { ConversationScreen } from '@/components/features/conversation/conversation-screen';
import { useAppState } from '@/providers/app-state-provider';

export default function ConversationRoute() {
  const { hasCompletedRoleSelection } = useAppState();

  if (!hasCompletedRoleSelection) {
    return <Redirect href="/role-selection" />;
  }

  return <ConversationScreen />;
}
