import { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

interface AppScreenProps extends PropsWithChildren {
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  decorativeBackground?: boolean;
}

export function AppScreen({
  children,
  scrollable = false,
  contentStyle,
  decorativeBackground = true,
}: AppScreenProps) {
  return (
    <View style={styles.background}>
      {decorativeBackground ? <View style={styles.skyGlow} /> : null}
      {decorativeBackground ? <View style={styles.bottomGlow} /> : null}
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {scrollable ? (
          <ScrollView contentContainerStyle={[styles.scrollContent, contentStyle]} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  skyGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#E8F5F5',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    right: -20,
    height: 260,
    backgroundColor: '#F2E0C5',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    opacity: 0.35,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});
