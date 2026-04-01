import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { theme } from '@/constants/theme';
import { useMemories } from '@/hooks/use-memories';

export function MemoriesScreen() {
  const { data, error, isLoading, reload } = useMemories();

  if (isLoading) return <AppScreen><LoadingView body="正在翻开记忆卡片。" title="记忆页加载中" /></AppScreen>;
  if (error || !data) return <AppScreen><ErrorView actionLabel="重新加载" body={error ?? '加载失败'} onAction={reload} title="记忆页没打开" /></AppScreen>;

  return (
    <AppScreen scrollable contentStyle={styles.content}>
      <View style={styles.frame}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <Ionicons color="#C18B63" name="close-circle" size={26} />
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.nicknamePill}>
            <Text style={styles.nicknameText}>🐻 {data.nickname}</Text>
          </View>
          <View style={styles.progressLine}>
            <View style={[styles.progressFill, { width: `${data.relationshipProgress * 100}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            {data.relationshipLabels.map((label) => (
              <Text key={label} style={styles.progressLabel}>{label}</Text>
            ))}
          </View>
        </View>
        <View style={styles.cards}>
          {data.cards.map((card) => (
            <View key={card.id} style={[styles.noteCard, { backgroundColor: card.color, transform: [{ rotate: card.rotation }] }]}>
              <Text style={styles.noteTitle}>{card.title}</Text>
              <Text style={styles.noteBody}>{card.body}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>{data.footer}</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 12, paddingBottom: 120 },
  frame: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#8E5732',
    backgroundColor: '#FFF3DE',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#925635',
  },
  title: { color: theme.colors.white, ...theme.typography.headingMD },
  progressBlock: { padding: 16, alignItems: 'center' },
  nicknamePill: { borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FCEFD8' },
  nicknameText: { color: theme.colors.textMain, ...theme.typography.caption },
  progressLine: { width: '100%', height: 10, borderRadius: 999, backgroundColor: '#D7B18F', marginVertical: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#7BA84F' },
  progressLabels: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: theme.colors.textSub, ...theme.typography.caption },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10, rowGap: 12, paddingBottom: 16 },
  noteCard: { width: '47%', minHeight: 130, borderRadius: 28, padding: 18 },
  noteTitle: { color: '#503D2B', marginBottom: 8, ...theme.typography.headingMD },
  noteBody: { color: '#503D2B', ...theme.typography.bodyMD },
  footer: { textAlign: 'center', color: theme.colors.textSub, paddingHorizontal: 20, paddingBottom: 18, ...theme.typography.caption },
});
