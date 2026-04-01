import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

interface StatusViewProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function LoadingView({ title, body }: StatusViewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

export function ErrorView({ title, body, actionLabel, onAction }: StatusViewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
          <Text style={styles.linkLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyView({ title, body }: StatusViewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.bgCard,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textMain,
    ...theme.typography.headingMD,
  },
  body: {
    color: theme.colors.textSub,
    textAlign: 'center',
    ...theme.typography.bodyMD,
  },
  linkButton: {
    marginTop: theme.spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  linkLabel: {
    color: '#B86C28',
    ...theme.typography.bodyMD,
  },
});
