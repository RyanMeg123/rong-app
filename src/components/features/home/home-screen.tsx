import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { theme } from '@/constants/theme';
import { useHome } from '@/hooks/use-home';

const HERO_IMAGE = require('../../../../assets/stitch/home-hero.jpg');
const CAT_IMAGE = require('../../../../assets/stitch/home-cat.jpg');

export function HomeScreen() {
  const { data, error, isLoading, reload } = useHome();

  if (isLoading) return <AppScreen><LoadingView body="正在铺开今天的小森林。" title="首页加载中" /></AppScreen>;
  if (error || !data) return <AppScreen><ErrorView actionLabel="重新加载" body={error ?? '加载失败'} onAction={reload} title="首页暂时没打开" /></AppScreen>;

  return (
    <AppScreen scrollable contentStyle={styles.content}>
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.heroCard}>
        <Image contentFit="cover" source={HERO_IMAGE} style={styles.heroImage} />
      </View>
      <View style={styles.catWrap}>
        <Image contentFit="cover" source={CAT_IMAGE} style={styles.catImage} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{data.speechBubble}</Text>
        </View>
      </View>
      <View style={styles.statusPill}>
        <Text style={styles.statusIcon}>🍂</Text>
        <Text style={styles.statusText}>{data.statusText}</Text>
      </View>
      <PrimaryButton label={data.primaryActionLabel} onPress={() => router.push('/conversation')} />
      <View style={styles.quickActions}>
        {data.quickActions.map((item) => (
          <Pressable key={item.id} style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}>
            <Text style={styles.quickTitle}>{item.title}</Text>
            <Text style={styles.quickEmoji}>{item.illustration}</Text>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.textMain,
    marginBottom: 16,
    ...theme.typography.headingLG,
  },
  heroCard: {
    height: 104,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    backgroundColor: '#E3B57A',
  },
  heroImage: { width: '100%', height: '100%' },
  catWrap: { alignItems: 'center', marginTop: 14 },
  catImage: { width: 108, height: 108 },
  bubble: {
    position: 'absolute',
    right: 34,
    top: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: '#E0C9AB',
  },
  bubbleText: { color: theme.colors.textMain, ...theme.typography.caption },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: '#EFE1C8',
  },
  statusIcon: { fontSize: 16 },
  statusText: { color: theme.colors.textSub, ...theme.typography.caption },
  quickActions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  quickCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0CFB9',
    backgroundColor: '#FFF8EE',
    padding: 14,
    justifyContent: 'space-between',
  },
  quickTitle: { color: theme.colors.textMain, ...theme.typography.bodyMD },
  quickEmoji: { textAlign: 'right', fontSize: 30 },
  pressed: { transform: [{ scale: 0.98 }] },
});
