import { Redirect } from 'expo-router';

import { useAppState } from '@/providers/app-state-provider';

export default function IndexScreen() {
  const { hasCompletedRoleSelection } = useAppState();

  if (hasCompletedRoleSelection) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/loading" />;
}
