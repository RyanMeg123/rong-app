import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { theme } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';

const PROFILE_CAT = require('../../../../assets/stitch/profile-cat.jpg');
const PROFILE_BEAR = require('../../../../assets/stitch/bear-avatar.jpg');

export function ProfileScreen() {
  const { data, error, isLoading, reload } = useProfile();

  if (isLoading) return <AppScreen><LoadingView body="正在整理树洞档案。" title="我的页加载中" /></AppScreen>;
  if (error || !data) return <AppScreen><ErrorView actionLabel="重新加载" body={error ?? '加载失败'} onAction={reload} title="我的页没打开" /></AppScreen>;

  return (
    <AppScreen scrollable contentStyle={styles.content}>
      <View style={styles.profileCard}>
        <Image source={PROFILE_CAT} style={styles.profileAvatar} />
        <View style={styles.profileCopy}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.subtitle}>{data.subtitle}</Text>
          <Text style={styles.days}>{data.daysTogether}</Text>
        </View>
        <Image source={PROFILE_BEAR} style={styles.badgeAvatar} />
        <View style={styles.progressLine}>
          <View style={styles.progressSprout} />
        </View>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>{data.relationshipLevel}</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>{data.bannerText}</Text>
        <Pressable style={({ pressed }) => [styles.learnMore, pressed && styles.pressed]}>
          <Text style={styles.learnMoreLabel}>去看看</Text>
        </Pressable>
      </View>

      {data.menuItems.map((item) => (
        <Pressable key={item.id} style={({ pressed }) => [styles.menuCard, pressed && styles.pressed]}>
          <Ionicons color={theme.colors.textMain} name={item.icon as never} size={20} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons color="#C39B72" name="chevron-down" size={18} />
        </Pressable>
      ))}

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>{data.footerTitle}</Text>
        <Text style={styles.footerBody}>{data.footerBody}</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 120, gap: 12 },
  profileCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#8B5F34',
    backgroundColor: '#FFF4E0',
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...theme.shadow.card,
  },
  profileAvatar: { width: 58, height: 58, borderRadius: 29, marginRight: 12 },
  profileCopy: { flex: 1 },
  title: { color: theme.colors.textMain, ...theme.typography.headingMD },
  subtitle: { color: theme.colors.textMain, ...theme.typography.caption },
  days: { color: theme.colors.textMain, marginTop: 10, ...theme.typography.bodyMD },
  badgeAvatar: { width: 36, height: 36, borderRadius: 18 },
  progressLine: { width: '100%', height: 10, marginTop: 12, borderRadius: 999, backgroundColor: '#E3D175' },
  progressSprout: { width: '65%', height: '100%', borderRadius: 999, backgroundColor: '#A5C75A' },
  levelPill: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 6, borderRadius: theme.radius.full, borderWidth: 1, borderColor: '#DDBB88', backgroundColor: '#FFF7EC' },
  levelText: { color: theme.colors.textMain, ...theme.typography.caption },
  banner: { flexDirection: 'row', alignItems: 'center', borderRadius: 22, backgroundColor: '#F6C86C', padding: 14, gap: 12 },
  bannerText: { flex: 1, color: '#6A3E17', ...theme.typography.bodyMD },
  learnMore: { minHeight: 40, borderRadius: 20, backgroundColor: '#B67A3E', justifyContent: 'center', paddingHorizontal: 16 },
  learnMoreLabel: { color: theme.colors.white, ...theme.typography.caption },
  menuCard: { minHeight: 64, borderRadius: 18, borderWidth: 1.5, borderColor: '#7E5633', backgroundColor: '#FFF6E8', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { flex: 1, color: theme.colors.textMain, ...theme.typography.bodyMD },
  footerCard: { borderRadius: 18, borderWidth: 1.5, borderColor: '#7E5633', backgroundColor: '#FFF6E8', padding: 16 },
  footerTitle: { color: theme.colors.textMain, ...theme.typography.bodyMD },
  footerBody: { color: theme.colors.textSub, marginTop: 4, ...theme.typography.caption },
  pressed: { opacity: 0.8 },
});
