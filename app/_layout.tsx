import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { theme } from '@/constants/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LemiBoBoTi: require('../assets/fonts/runtime/LemiBoBoTi.ttf'),
    BubblegumSans: require('../assets/fonts/runtime/BubblegumSans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={theme.colors.bg} />
        <Stack
          screenOptions={{
            animation: 'none',
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.bg },
          }}>
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
