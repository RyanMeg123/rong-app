import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

import { styles } from '../immersive-companion.styles';

type VoiceButtonProps = {
  selectedPresetLabel: string;
  onPress: () => void;
};

export function VoiceButton({ selectedPresetLabel, onPress }: VoiceButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.voiceButton}>
      <View style={styles.voiceIconWrap}>
        <MaterialCommunityIcons color={theme.colors.white} name="microphone" size={26} />
      </View>
      <View style={styles.voiceTextWrap}>
        <Text style={styles.voiceTitle}>对它说话</Text>
        <Text style={styles.voiceSubtitle}>现在会按“{selectedPresetLabel}”这一档张嘴回应你</Text>
      </View>
      <Feather color={theme.colors.lineStrong} name="arrow-right" size={20} />
    </Pressable>
  );
}
