import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/app-screen';
import { ErrorView, LoadingView } from '@/components/ui/status-view';
import { theme } from '@/constants/theme';
import { useConversation } from '@/hooks/use-conversation';

const BEAR_AVATAR = require('../../../../assets/stitch/bear-avatar.jpg');

export function ConversationScreen() {
  const { data, error, isLoading, reload } = useConversation();

  if (isLoading) return <AppScreen><LoadingView body="正在回到树洞里。" title="对话加载中" /></AppScreen>;
  if (error || !data) return <AppScreen><ErrorView actionLabel="重新加载" body={error ?? '加载失败'} onAction={reload} title="对话页没打开" /></AppScreen>;

  return (
    <AppScreen contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Ionicons color={theme.colors.textSub} name="chevron-back" size={18} />
        </Pressable>
        <Image source={BEAR_AVATAR} style={styles.avatar} />
        <Text style={styles.headerTitle}>{data.title}</Text>
      </View>
      <View style={styles.memoryHint}>
        <Text style={styles.memoryText}>🍂 {data.memoryHint}</Text>
      </View>
      <View style={styles.chatArea}>
        {data.messages.map((message) => (
          <View key={message.id} style={[styles.messageRow, message.role === 'user' ? styles.userRow : styles.companionRow]}>
            {message.role === 'companion' ? <Image source={BEAR_AVATAR} style={styles.smallAvatar} /> : null}
            <View style={[styles.messageBubble, message.role === 'user' ? styles.userBubble : styles.companionBubble]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.inputWrap}>
        <TextInput placeholder="把想说的话写下来..." placeholderTextColor="#B8A28A" style={styles.input} />
        <Pressable style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}>
          <Ionicons color="#B66D27" name="paper-plane-outline" size={18} />
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF0E0',
    borderBottomWidth: 1,
    borderColor: '#E6D3B7',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  backButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  headerTitle: { color: '#A16632', ...theme.typography.headingMD },
  memoryHint: { paddingVertical: 8, backgroundColor: '#F5E9D6' },
  memoryText: { textAlign: 'center', color: theme.colors.textSub, ...theme.typography.caption },
  chatArea: { flex: 1, paddingHorizontal: 16, paddingVertical: 18, gap: 14 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { justifyContent: 'flex-end' },
  companionRow: { justifyContent: 'flex-start' },
  smallAvatar: { width: 28, height: 28, borderRadius: 14 },
  messageBubble: { maxWidth: '76%', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12 },
  userBubble: { backgroundColor: '#F7BE7B', borderTopRightRadius: 10 },
  companionBubble: { backgroundColor: theme.colors.bgCard, borderTopLeftRadius: 10 },
  messageText: { color: theme.colors.textMain, ...theme.typography.bodyMD },
  inputWrap: {
    marginHorizontal: 12,
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C3A19',
    backgroundColor: '#FFF6E7',
    borderRadius: 26,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  input: { flex: 1, color: theme.colors.textMain, ...theme.typography.bodyMD },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  pressed: { opacity: 0.75 },
});
