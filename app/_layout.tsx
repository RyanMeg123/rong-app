import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { theme } from '@/constants/theme';
import { AppStateProvider } from '@/providers/app-state-provider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <StatusBar style="dark" backgroundColor={theme.colors.bg} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.bg },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="conversation" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
