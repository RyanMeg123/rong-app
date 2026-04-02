export interface RoleCardData {
  id: string;
  name: string;
  title: string;
  description: string;
  image: number;
  video?: number;
  selectedVideo?: number;
  accent: string;
}

export interface HomeQuickAction {
  id: string;
  title: string;
  illustration: string;
}

export interface HomeData {
  title: string;
  prompt: string;
  companionName: string;
  speechBubble: string;
  statusText: string;
  primaryActionLabel: string;
  quickActions: HomeQuickAction[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'companion';
  text: string;
  time?: string;
}

export interface ConversationData {
  title: string;
  memoryHint: string;
  messages: ConversationMessage[];
}

export interface MemoryCard {
  id: string;
  title: string;
  body: string;
  color: string;
  rotation: string;
}

export interface MemoriesData {
  title: string;
  nickname: string;
  relationshipLabels: [string, string, string];
  relationshipProgress: number;
  cards: MemoryCard[];
  footer: string;
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: string;
}

export interface ProfileData {
  title: string;
  subtitle: string;
  daysTogether: string;
  relationshipLevel: string;
  bannerText: string;
  menuItems: ProfileMenuItem[];
  footerTitle: string;
  footerBody: string;
}
