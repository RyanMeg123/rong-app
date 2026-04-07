import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

import type { MessageType, QuickAction } from '../immersive-companion.data';
import { styles } from '../immersive-companion.styles';

type QuickActionRowProps = {
  actions: QuickAction[];
  onPress: (type: MessageType) => void;
};

export function QuickActionRow({ actions, onPress }: QuickActionRowProps) {
  return (
    <View style={styles.quickActionRow}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          onPress={() => onPress(action.id)}
          style={styles.quickActionButton}>
          <MaterialCommunityIcons color={theme.colors.lineStrong} name={action.icon} size={18} />
          <Text style={styles.quickActionText}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
