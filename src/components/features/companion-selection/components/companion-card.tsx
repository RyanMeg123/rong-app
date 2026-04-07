import { Ionicons } from '@expo/vector-icons';
import { DotLottie } from '@lottiefiles/dotlottie-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/constants/theme';

import type { Companion } from '../companion-selection.data';
import { styles } from '../companion-selection.styles';

type CompanionCardProps = {
  companion: Companion;
  heroHeight: number;
  lottieStyle: ViewStyle;
  liked?: boolean;
  onToggleLiked?: () => void;
  isPreview?: boolean;
  overlapOffset: number;
};

export function CompanionCard({
  companion,
  heroHeight,
  isPreview = false,
  liked = false,
  lottieStyle,
  onToggleLiked,
  overlapOffset,
}: CompanionCardProps) {
  return (
    <View style={[StyleSheet.absoluteFill, cardStyles.root]}>
      <View style={styles.companionCard}>
        {/* Hero area: lottie contained within, overflow clipped to card */}
        <View style={[styles.heroStage, { height: heroHeight }]}>
          <DotLottie autoplay loop source={companion.animationSource} style={lottieStyle} />
        </View>

        {companion.placeholderLabel ? (
          <View style={styles.placeholderBadge}>
            <Text style={styles.placeholderBadgeText}>{companion.placeholderLabel}</Text>
          </View>
        ) : null}

        {!isPreview ? (
          <Pressable
            accessibilityRole="button"
            onPress={onToggleLiked}
            style={styles.favoriteButton}>
            <Ionicons
              color={theme.colors.white}
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
            />
          </Pressable>
        ) : null}

        {/* Info panel: header fixed, description scrollable */}
        <View style={[styles.infoPanel, { marginTop: -overlapOffset }]}>
          <View style={styles.infoHeader}>
            <View style={styles.identityWrap}>
              <Text style={styles.companionName}>{companion.name}</Text>
              <Text style={styles.companionEnglish}>{companion.englishName}</Text>
            </View>

            <View style={styles.tagGroup}>
              {companion.tags.map((tag) => (
                <View key={tag.id} style={[styles.tag, { backgroundColor: tag.backgroundColor }]}>
                  <Text style={[styles.tagText, { color: tag.textColor }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Scrollable description — finger can scroll text without triggering card swipe */}
          <ScrollView
            bounces={false}
            nestedScrollEnabled
            scrollEnabled={!isPreview}
            showsVerticalScrollIndicator={false}
            style={styles.descriptionScroll}>
            <Text style={styles.description}>{companion.description}</Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  root: {
    justifyContent: 'flex-start',
  },
});
