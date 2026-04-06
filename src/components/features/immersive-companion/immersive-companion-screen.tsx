import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated, PanResponder, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

import { CompanionStage } from './components/companion-stage';
import { ImmersiveHeader } from './components/immersive-header';
import { InteractionFeed } from './components/interaction-feed';
import { QuickActionRow } from './components/quick-action-row';
import { SoundCard } from './components/sound-card';
import { VoiceButton } from './components/voice-button';
import {
  MessageItem,
  MessageType,
  pickNextMessage,
  quickActions,
  resolveCompanion,
  resolvePresetId,
  soundPresets,
} from './immersive-companion.data';
import { styles } from './immersive-companion.styles';

export function ImmersiveCompanionScreen() {
  const params = useLocalSearchParams<{ presetId?: string; companionId?: string }>();
  const currentCompanion = useMemo(
    () => resolveCompanion(typeof params.companionId === 'string' ? params.companionId : undefined),
    [params.companionId]
  );
  const presetParamId = typeof params.presetId === 'string' ? params.presetId : undefined;
  const [history, setHistory] = useState<MessageItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPurring, setIsPurring] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState(0);
  const [selectedPresetId, setSelectedPresetId] = useState(() =>
    resolvePresetId(presetParamId, currentCompanion.defaultPresetId)
  );

  const mouthAnimation = useRef(new Animated.Value(0)).current;
  const bodyFloat = useRef(new Animated.Value(0)).current;
  const avatarTilt = useRef(new Animated.Value(0)).current;
  const bubblePop = useRef(new Animated.Value(1)).current;
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetedCompanionIdRef = useRef<string | null>(null);
  const messageCountsRef = useRef<Record<MessageType, number>>({
    greeting: 0,
    poke: 0,
    purr: 0,
    care: 0,
    mic: 0,
  });
  const selectedPreset = useMemo(
    () => soundPresets.find((preset) => preset.id === selectedPresetId) ?? soundPresets[0],
    [selectedPresetId]
  );

  useEffect(() => {
    setSelectedPresetId(resolvePresetId(presetParamId, currentCompanion.defaultPresetId));
  }, [currentCompanion.defaultPresetId, presetParamId]);

  useEffect(() => {
    messageCountsRef.current = {
      greeting: 0,
      poke: 0,
      purr: 0,
      care: 0,
      mic: 0,
    };
    greetedCompanionIdRef.current = null;
    Speech.stop();
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    setHistory([]);
    setFloatingHearts(0);
    setIsPurring(false);
    setIsSpeaking(false);
  }, [currentCompanion.id]);

  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(bodyFloat, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(bodyFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    floating.start();

    return () => floating.stop();
  }, [bodyFloat]);

  useEffect(
    () => () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
      Speech.stop();
    },
    []
  );

  useEffect(() => {
    if (!isSpeaking) {
      mouthAnimation.stopAnimation();
      mouthAnimation.setValue(0);
      return;
    }

    const talking = Animated.loop(
      Animated.sequence([
        Animated.timing(mouthAnimation, {
          toValue: 1,
          duration: selectedPreset.mouthSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(mouthAnimation, {
          toValue: 0,
          duration: selectedPreset.mouthSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    talking.start();

    return () => talking.stop();
  }, [isSpeaking, mouthAnimation, selectedPreset]);

  const speakFromType = useCallback(async (type: MessageType) => {
    const count = messageCountsRef.current[type];
    const text = pickNextMessage(currentCompanion, type, count);

    messageCountsRef.current = {
      ...messageCountsRef.current,
      [type]: count + 1,
    };
    setHistory((prev) => [...prev.slice(-3), { id: `${type}-${Date.now()}`, type, text }]);
    setIsSpeaking(true);

    Animated.sequence([
      Animated.timing(bubblePop, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bubblePop, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    await Haptics.selectionAsync();

    const speakingDuration = Math.min(3800, Math.max(1500, text.length * (selectedPreset.rate < 0.9 ? 184 : 164)));

    Speech.stop();
    Speech.speak(text, {
      language: 'zh-CN',
      pitch: type === 'purr' ? Math.min(1.45, selectedPreset.pitch + 0.08) : selectedPreset.pitch,
      rate: type === 'purr' ? Math.max(0.78, selectedPreset.rate - 0.04) : selectedPreset.rate,
      onDone: () => {
        setIsSpeaking(false);
      },
      onStopped: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });

    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }

    speakingTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
    }, speakingDuration);
  }, [bubblePop, currentCompanion, selectedPreset]);

  useEffect(() => {
    if (greetedCompanionIdRef.current === currentCompanion.id) {
      return;
    }

    greetedCompanionIdRef.current = currentCompanion.id;
    void speakFromType('greeting');
  }, [currentCompanion.id, speakFromType]);

  const latestMessage = history[history.length - 1];

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
        onPanResponderGrant: () => {
          setIsPurring(true);
          setFloatingHearts((value) => value + 1);
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          void speakFromType('purr');
        },
        onPanResponderMove: (_, gestureState) => {
          const tilt = Math.max(-1, Math.min(1, gestureState.dx / 55));
          avatarTilt.setValue(tilt);
        },
        onPanResponderRelease: () => {
          Animated.spring(avatarTilt, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }).start();
          setTimeout(() => setIsPurring(false), 700);
        },
        onPanResponderTerminate: () => {
          Animated.spring(avatarTilt, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }).start();
          setIsPurring(false);
        },
      }),
    [avatarTilt, speakFromType]
  );

  const mouthHeight = mouthAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const avatarRotate = avatarTilt.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-7deg', '7deg'],
  });

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    void Haptics.selectionAsync();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.background}>
        <View style={styles.haloOne} />
        <View style={styles.haloTwo} />
      </View>

      <ImmersiveHeader onBack={() => router.back()} />

      <ScrollView bounces={false} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CompanionStage
          avatarRotate={avatarRotate}
          bodyFloat={bodyFloat}
          bubblePop={bubblePop}
          currentCompanion={currentCompanion}
          floatingHearts={floatingHearts}
          isPurring={isPurring}
          latestMessageText={latestMessage?.text}
          mouthHeight={mouthHeight}
          onPoke={() => void speakFromType('poke')}
          panHandlers={panResponder.panHandlers}
          selectedPresetLabel={selectedPreset.label}
        />

        <QuickActionRow actions={quickActions} onPress={(type) => void speakFromType(type)} />
        <SoundCard presets={soundPresets} selectedPresetId={selectedPresetId} onSelect={handlePresetSelect} />
        <InteractionFeed history={history} />
        <VoiceButton selectedPresetLabel={selectedPreset.label} onPress={() => void speakFromType('mic')} />
      </ScrollView>
    </SafeAreaView>
  );
}
