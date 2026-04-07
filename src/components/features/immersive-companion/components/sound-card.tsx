import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

import type { SoundPreset } from '../immersive-companion.data';
import { styles } from '../immersive-companion.styles';

type SoundCardProps = {
  presets: SoundPreset[];
  selectedPresetId: string;
  onSelect: (presetId: string) => void;
};

export function SoundCard({ presets, selectedPresetId, onSelect }: SoundCardProps) {
  return (
    <View style={styles.soundCard}>
      <Text style={styles.soundCardTitle}>陪伴音色</Text>
      <Text style={styles.soundCardSubtitle}>先选一种声音感觉，它张嘴说话时会跟着这一档节奏走</Text>

      <View style={styles.soundPresetGrid}>
        {presets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;

          return (
            <Pressable
              key={preset.id}
              accessibilityRole="button"
              onPress={() => onSelect(preset.id)}
              style={[styles.soundPresetCard, isSelected && styles.soundPresetCardActive]}>
              <View style={[styles.soundPresetIcon, { backgroundColor: preset.circleColor }]}>
                <MaterialCommunityIcons color={theme.colors.white} name={preset.icon} size={18} />
              </View>
              <View style={styles.soundPresetTextWrap}>
                <Text style={styles.soundPresetName}>{preset.label}</Text>
                <Text style={styles.soundPresetSubtitle}>{preset.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
