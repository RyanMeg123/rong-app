import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { Animated, PanResponderInstance, Pressable, Text, View } from 'react-native';

import type { CompanionDefinition } from '../immersive-companion.data';
import { styles } from '../immersive-companion.styles';

type CompanionStageProps = {
  currentCompanion: CompanionDefinition;
  selectedPresetLabel: string;
  latestMessageText?: string;
  bubblePop: Animated.AnimatedInterpolation<number> | Animated.Value;
  bodyFloat: Animated.AnimatedInterpolation<number> | Animated.Value;
  avatarRotate: Animated.AnimatedInterpolation<string | number>;
  mouthHeight: Animated.AnimatedInterpolation<number>;
  panHandlers: PanResponderInstance['panHandlers'];
  isPurring: boolean;
  floatingHearts: number;
  onPoke: () => void;
};

export function CompanionStage({
  currentCompanion,
  selectedPresetLabel,
  latestMessageText,
  bubblePop,
  bodyFloat,
  avatarRotate,
  mouthHeight,
  panHandlers,
  isPurring,
  floatingHearts,
  onPoke,
}: CompanionStageProps) {
  return (
    <View style={styles.stageCard}>
      <View style={styles.stageBackdrop} />
      <View style={styles.stageRing} />
      <View style={styles.stageGlow} />

      <Animated.View
        style={[
          styles.messageBubble,
          {
            transform: [{ scale: bubblePop }],
          },
        ]}>
        <Text style={styles.messageLabel}>当前音色：{selectedPresetLabel}</Text>
        <Text style={styles.messageText}>{latestMessageText ?? currentCompanion.idleMessage}</Text>
      </Animated.View>

      <Animated.View
        {...panHandlers}
        style={[
          styles.avatarWrap,
          {
            transform: [{ translateY: bodyFloat }, { rotate: avatarRotate }, { scale: mouthHeight }],
          },
        ]}>
        <Pressable accessibilityRole="button" onPress={onPoke} style={styles.avatarPressable}>
          <View style={styles.characterShell}>
            <DotLottie autoplay loop source={currentCompanion.animationSource} style={styles.characterLottie} />
          </View>
        </Pressable>

        {isPurring ? <Text style={styles.purrText}>{currentCompanion.purrText}</Text> : null}
        {floatingHearts > 0 ? (
          <View style={styles.heartColumn}>
            <Text style={styles.heart}>❤</Text>
            <Text style={styles.heartSecondary}>❤</Text>
          </View>
        ) : null}
      </Animated.View>

      <View style={styles.stageFooter}>
        <Text style={styles.stageTitle}>{currentCompanion.stageTitle}</Text>
        <Text style={styles.stageHint}>{currentCompanion.stageHint}</Text>
      </View>
    </View>
  );
}
