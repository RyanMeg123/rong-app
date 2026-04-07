import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

import { companions, wrapIndex } from './companion-selection.data';
import { styles } from './companion-selection.styles';
import { CompanionCard } from './components/companion-card';
import { SwipeableCard } from './components/swipeable-card';

export function CompanionSelectionScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({
    [companions[0].id]: true,
    [companions[1].id]: false,
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentCompanion = companions[currentIndex];
  const nextCompanion = companions[wrapIndex(currentIndex + 1)];
  const liked = likedIds[currentCompanion.id] ?? false;

  // Card area: full width, sits between title and bottom chrome
  const cardAreaHeight = Math.max(screenHeight * 0.58, 392);
  const cardWidth = Math.min(screenWidth - 34, 430);

  // Hero stage takes top portion of card; info panel overlaps from below
  const heroHeight = Math.round(cardAreaHeight * 0.72);
  const infoPanelOverlap = Math.round(heroHeight * 0.08);

  // Lottie is positioned absolute relative to companionCard.
  // It extends ~42% below the heroStage so the character's face shows
  // in the hero area and hands peek over the white info panel.
  const lottieStyle: ViewStyle = {
    position: 'absolute',
    width: cardWidth * 1.08,
    height: heroHeight * 1.56,
    left: '50%',
    marginLeft: -(cardWidth * 1.08) / 2,
    top: -120,
  };

  // Behind card animates up / scales in as top card is dragged
  const behindStyle = useAnimatedStyle(() => {
    const drag = Math.abs(translateX.value);
    const progress = Math.min(drag / 80, 1);
    return {
      transform: [
        { scale: interpolate(progress, [0, 1], [0.93, 1.0]) },
        { translateY: interpolate(progress, [0, 1], [18, 0]) },
      ],
      opacity: interpolate(progress, [0, 0.5], [0.68, 1.0]),
    };
  });

  const handleSwipe = useCallback(
    (direction: 1 | -1) => {
      // Reset shared values first so the incoming card starts at origin
      translateX.value = 0;
      translateY.value = 0;
      // direction > 0 = right swipe → previous; direction < 0 = left swipe → next
      setCurrentIndex((prev) => wrapIndex(prev + (direction > 0 ? -1 : 1)));
    },
    [translateX, translateY]
  );

  const toggleLiked = () => {
    setLikedIds((prev) => ({
      ...prev,
      [currentCompanion.id]: !(prev[currentCompanion.id] ?? false),
    }));
  };

  const openCompanion = () => {
    router.push({
      pathname: '/companion',
      params: { companionId: currentCompanion.id },
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Ambient glow background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
      </View>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable accessibilityRole="button" style={styles.headerButton}>
          <Feather color={theme.colors.lineStrong} name="chevron-left" size={22} />
        </Pressable>
        <View style={styles.brandWrap}>
          <Text style={styles.brand}>绒绒树洞</Text>
        </View>
        <Pressable accessibilityRole="button" style={styles.headerIconButton}>
          <Feather color={theme.colors.lineStrong} name="image" size={17} />
        </Pressable>
      </View>

      {/* ── Title ── */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>选一位伙伴陪你吧</Text>
        <Text style={styles.subtitle}>在这里，每一份情绪都会被温柔地接住</Text>
      </View>

      {/* ── Card Stack ── */}
      <View style={[styles.stackSection, { height: cardAreaHeight }]}>
        {/* Behind card — non-interactive, animates in sync with drag */}
        <Animated.View
          key={`behind-${nextCompanion.id}`}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, behindStyle]}>
          <CompanionCard
            companion={nextCompanion}
            heroHeight={heroHeight}
            isPreview
            lottieStyle={lottieStyle}
            overlapOffset={infoPanelOverlap}
          />
        </Animated.View>

        {/* Top card — swipeable */}
        <SwipeableCard
          key={`top-${currentCompanion.id}`}
          translateX={translateX}
          translateY={translateY}
          screenWidth={screenWidth}
          onSwipe={handleSwipe}>
          <CompanionCard
            companion={currentCompanion}
            heroHeight={heroHeight}
            liked={liked}
            lottieStyle={lottieStyle}
            overlapOffset={infoPanelOverlap}
            onToggleLiked={toggleLiked}
          />
        </SwipeableCard>
      </View>

      {/* ── Bottom chrome ── */}
      <View style={styles.bottomSection}>
        <View style={styles.swipeHintRow}>
          <Feather color={theme.colors.textSub} name="arrow-left" size={14} />
          <Text style={styles.swipeHintText}>左右滑动，切换下一位伙伴</Text>
          <Feather color={theme.colors.textSub} name="arrow-right" size={14} />
        </View>

        <View style={styles.pagination}>
          {companions.map((item, index) => (
            <View
              key={item.id}
              style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openCompanion}
          style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>开启陪伴</Text>
          <Feather color={theme.colors.textMain} name="arrow-right" size={22} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
