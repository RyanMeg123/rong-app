import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>预留弹层页</Text>
      <Pressable onPress={() => router.back()} style={styles.link}>
        <Text style={styles.linkText}>返回上一页</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.bg,
  },
  title: {
    color: theme.colors.textMain,
    ...theme.typography.headingLG,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: theme.colors.primary,
    ...theme.typography.bodyMD,
  },
});
