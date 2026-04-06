import { Text, View } from 'react-native';

import type { MessageItem } from '../immersive-companion.data';
import { styles } from '../immersive-companion.styles';

type InteractionFeedProps = {
  history: MessageItem[];
};

export function InteractionFeed({ history }: InteractionFeedProps) {
  return (
    <View style={styles.feedCard}>
      <Text style={styles.feedTitle}>互动小剧场</Text>
      {history
        .slice()
        .reverse()
        .map((item) => (
          <View key={item.id} style={styles.feedBubble}>
            <Text style={styles.feedBubbleText}>{item.text}</Text>
          </View>
        ))}
    </View>
  );
}
