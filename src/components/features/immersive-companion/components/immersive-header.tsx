import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

import { styles } from '../immersive-companion.styles';

type ImmersiveHeaderProps = {
  onBack: () => void;
};

export function ImmersiveHeader({ onBack }: ImmersiveHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
        <Feather color={theme.colors.lineStrong} name="chevron-left" size={22} />
      </Pressable>

      <View style={styles.brandWrap}>
        <Text style={styles.brand}>绒绒树洞</Text>
        <Text style={styles.brandSub}>沉浸式沟通</Text>
      </View>

      <Pressable accessibilityRole="button" style={styles.headerButton}>
        <Feather color={theme.colors.lineStrong} name="image" size={18} />
      </Pressable>
    </View>
  );
}
