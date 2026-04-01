import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import type { RoleCardData } from '@/types/api';

interface RoleCardProps {
  role: RoleCardData;
  selected: boolean;
  onPress: () => void;
}

export function RoleCard({ role, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}>
      <View style={[styles.imageWrap, { backgroundColor: role.accent }]}>
        <Image contentFit="cover" source={role.image} style={styles.image} />
      </View>
      <Text style={styles.name}>{role.name}</Text>
      <Text style={styles.description}>
        {role.title}，
        <Text style={styles.description}>{role.description}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    minHeight: 172,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BFA98F',
    backgroundColor: '#FFF5E8',
    alignItems: 'center',
    ...theme.shadow.card,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2.5,
    shadowOpacity: 0.18,
    transform: [{ translateY: -2 }],
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    width: 82,
    height: 82,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: theme.colors.textMain,
    textAlign: 'center',
    marginBottom: 4,
    ...theme.typography.headingMD,
  },
  description: {
    color: theme.colors.textSub,
    textAlign: 'center',
    ...theme.typography.caption,
  },
});
