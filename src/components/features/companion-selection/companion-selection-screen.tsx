import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

import { CompanionCard } from './components/companion-card';
import { companions, swipeThreshold, wrapIndex } from './companion-selection.data';
import { styles } from './companion-selection.styles';

export function CompanionSelectionScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<-1 | 0 | 1>(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({
    [companions[0].id]: true,
    [companions[1].id]: false,
  });

  const swipeX = useRef(new Animated.Value(0)).current;
  const currentCompanion = companions[currentIndex];
  const previewIndex = wrapIndex(currentIndex + (dragDirection > 0 ? -1 : 1));
  const previewCompanion = companions[previewIndex];
  const liked = likedIds[currentCompanion.id] ?? false;

  const cardWidth = screenWidth - 44;
  const heroHeight = Math.min(Math.max(cardWidth * 0.92, 300), 390);
  const infoPanelOverlap = Math.min(Math.round(heroHeight * 0.28), 116);
  const lottieFrameStyle = useMemo<ViewStyle>(
    () =>
      StyleSheet.flatten<ViewStyle>([
        styles.heroLottie,
        {
          width: cardWidth,
          height: heroHeight + 80,
          left: 0,
          top: -Math.round(heroHeight * 0.18),
        },
      ]),
    [cardWidth, heroHeight]
  );

  const advanceCard = useCallback(
    (direction: 1 | -1) => {
      setCurrentIndex((prev) => wrapIndex(prev + (direction > 0 ? 1 : -1)));
      setDragDirection(0);
      swipeX.setValue(0);
    },
    [swipeX]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isHorizontal =
            Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          if (isHorizontal) setScrollEnabled(false);
          return isHorizontal;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx !== 0) {
            setDragDirection(gestureState.dx > 0 ? 1 : -1);
          }
          swipeX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          setScrollEnabled(true);
          if (gestureState.dx <= -swipeThreshold) {
            Animated.timing(swipeX, {
              toValue: -420,
              duration: 180,
              useNativeDriver: true,
            }).start(() => advanceCard(1));
            return;
          }

          if (gestureState.dx >= swipeThreshold) {
            Animated.timing(swipeX, {
              toValue: 420,
              duration: 180,
              useNativeDriver: true,
            }).start(() => advanceCard(-1));
            return;
          }

          Animated.spring(swipeX, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }).start(() => setDragDirection(0));
        },
        onPanResponderTerminate: () => {
          setScrollEnabled(true);
          Animated.spring(swipeX, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }).start(() => setDragDirection(0));
        },
      }),
    [advanceCard, swipeX]
  );

  const topCardRotate = swipeX.interpolate({
    inputRange: [-240, 0, 240],
    outputRange: ['-10deg', '0deg', '10deg'],
  });
  const previewCardScale = swipeX.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0.98, 0.94, 0.98],
  });
  const previewCardTranslate = swipeX.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: [0, 18, 0],
  });
  const previewCardOpacity = swipeX.interpolate({
    inputRange: [-120, 0, 120],
    outputRange: [1, 0.88, 1],
  });

  const toggleLiked = () => {
    setLikedIds((prev) => ({
      ...prev,
      [currentCompanion.id]: !(prev[currentCompanion.id] ?? false),
    }));
  };

  const openCompanion = () => {
    router.push({
      pathname: '/companion',
      params: {
        companionId: currentCompanion.id,
      },
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.background}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
      </View>

      <ScrollView bounces={false} contentContainerStyle={styles.content} scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
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

        <Text style={styles.title}>选一位伙伴陪你吧</Text>
        <Text style={styles.subtitle}>在这里，每一份情绪都会被温柔地接住</Text>

        <View style={styles.stackWrap}>
          <Animated.View
            key={`preview-${previewCompanion.id}-${dragDirection}`}
            pointerEvents="none"
            style={[
              styles.previewCard,
              {
                opacity: previewCardOpacity,
                transform: [{ scale: previewCardScale }, { translateY: previewCardTranslate }],
              },
            ]}>
            <View style={[styles.previewCardClip, { height: heroHeight + 68 }]}>
              <CompanionCard
                companion={previewCompanion}
                heroHeight={heroHeight}
                isPreview
                lottieStyle={lottieFrameStyle}
                overlapOffset={infoPanelOverlap}
                style={styles.previewCardInner}
              />
            </View>
          </Animated.View>

          <CompanionCard
            key={`active-${currentCompanion.id}`}
            companion={currentCompanion}
            heroHeight={heroHeight}
            liked={liked}
            lottieStyle={lottieFrameStyle}
            onToggleLiked={toggleLiked}
            panHandlers={panResponder.panHandlers}
            overlapOffset={infoPanelOverlap}
            style={[
              styles.activeCard,
              {
                transform: [{ translateX: swipeX }, { rotate: topCardRotate }],
              },
            ]}
          />
        </View>

        <View style={styles.swipeHintRow}>
          <Feather color={theme.colors.textSub} name="arrow-left" size={16} />
          <Text style={styles.swipeHintText}>左右滑动，切换下一位伙伴</Text>
          <Feather color={theme.colors.textSub} name="arrow-right" size={16} />
        </View>

        <View style={styles.pagination}>
          {companions.map((item, index) => (
            <View key={item.id} style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.primaryButtonDock}>
        <Pressable accessibilityRole="button" onPress={openCompanion} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>开启陪伴</Text>
          <Feather color={theme.colors.textMain} name="arrow-right" size={22} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
