import { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';

const landingVideo = require('../../../../assets/video/landing.mp4');
const splashTitle = '欢迎来到绒绒树洞';
const splashTitleChars = [...splashTitle];

export function SplashScreen() {
  const charAnimations = useRef(splashTitleChars.map(() => new Animated.Value(0))).current;

  const player = useVideoPlayer(landingVideo, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  useEffect(() => {
    const animation = Animated.stagger(
      95,
      charAnimations.map((value) =>
        Animated.spring(value, {
          toValue: 1,
          useNativeDriver: true,
          tension: 52,
          friction: 8,
        })
      )
    );

    animation.start();

    return () => {
      animation.stop();
      charAnimations.forEach((value) => value.setValue(0));
    };
  }, [charAnimations]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.backdrop}>
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />
      </View>

      <View style={styles.mediaFrame}>
        <VideoView contentFit="cover" nativeControls={false} player={player} style={styles.video} />
        <View style={styles.mediaShade} />
      </View>

      <View style={[styles.centerCopyWrap, styles.noPointerEvents]}>
        <View style={styles.copyBlock}>
          <Text style={styles.eyebrow}>RONG RONG TREE HOLE</Text>
          <View style={styles.titleRow}>
            {splashTitleChars.map((char, index) => {
              const animationValue = charAnimations[index];

              return (
                <Animated.Text
                  key={`${char}-${index}`}
                  style={[
                    styles.title,
                    {
                      opacity: animationValue,
                      transform: [
                        {
                          translateY: animationValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [14, 0],
                          }),
                        },
                        {
                          scale: animationValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.92, 1],
                          }),
                        },
                      ],
                    },
                  ]}>
                  {char}
                </Animated.Text>
              );
            })}
          </View>
        </View>
      </View>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2B1D1A',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2B1D1A',
  },
  topGlow: {
    position: 'absolute',
    top: -120,
    left: -70,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#B65C32',
    opacity: 0.42,
  },
  bottomGlow: {
    position: 'absolute',
    right: -90,
    bottom: -40,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#6F8E5A',
    opacity: 0.34,
  },
  mediaFrame: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#160F0D',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14, 10, 9, 0.34)',
  },
  centerCopyWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 28,
    paddingTop: 176,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  copyBlock: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: theme.fonts.primary,
    color: '#F4D8B5',
    letterSpacing: 2.3,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(27, 15, 11, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  title: {
    fontFamily: theme.fonts.primary,
    color: theme.colors.white,
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    textShadowColor: 'rgba(27, 15, 11, 0.85)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  titleRow: {
    marginTop: 10,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 1,
  },
  footer: {
    minHeight: 24,
  },
});
