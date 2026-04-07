import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = 90;
const VELOCITY_THRESHOLD = 600;

type SwipeableCardProps = {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  screenWidth: number;
  onSwipe: (direction: 1 | -1) => void;
  children: ReactNode;
};

export function SwipeableCard({
  translateX,
  translateY,
  screenWidth,
  onSwipe,
  children,
}: SwipeableCardProps) {
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.18;
    })
    .onEnd((event) => {
      const pastThreshold =
        Math.abs(event.translationX) > SWIPE_THRESHOLD ||
        Math.abs(event.velocityX) > VELOCITY_THRESHOLD;

      if (pastThreshold) {
        const dir: 1 | -1 = event.translationX > 0 ? 1 : -1;
        // Add velocity to make the throw feel natural
        const targetX = dir * (screenWidth * 1.5 + Math.abs(event.velocityX) * 0.06);
        translateX.value = withTiming(targetX, { duration: 280 }, (finished) => {
          if (finished) runOnJS(onSwipe)(dir);
        });
        translateY.value = withTiming(translateY.value + event.velocityY * 0.04, { duration: 280 });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.8 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.8 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${interpolate(
          translateX.value,
          [-screenWidth * 0.6, 0, screenWidth * 0.6],
          [-16, 0, 16]
        )}deg`,
      },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.card, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    zIndex: 10,
  },
});
