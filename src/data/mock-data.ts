import type {
  ConversationData,
  HomeData,
  MemoriesData,
  ProfileData,
  RoleCardData,
} from '@/types/api';

export const ROLE_OPTIONS: RoleCardData[] = [
  {
    id: 'rabbit',
    name: '绒绒小兔',
    title: '温柔倾听者',
    description: '总是给你最柔软的拥抱。',
    image: require('../../assets/stitch/rabbit.jpg'),
    accent: '#F6B25F',
  },
  {
    id: 'bear',
    name: '憨憨熊',
    title: '忠实守护者',
    description: '用温暖化解你的烦恼。',
    image: require('../../assets/stitch/bear.jpg'),
    accent: '#D79A61',
  },
  {
    id: 'cat',
    name: '料理猫',
    title: '快乐制造家',
    description: '为你烹饪心灵美味。',
    image: require('../../assets/stitch/cat.jpg'),
    accent: '#F3C47E',
  },
  {
    id: 'fox',
    name: '机灵狐',
    title: '智慧聆听师',
    description: '为你找到问题的答案。',
    image: require('../../assets/stitch/fox.jpg'),
    accent: '#EEA45B',
  },
];

export const HOME_DATA: HomeData = {
  title: '绒绒树洞',
  prompt: '现在想说点什么',
  companionName: '料理猫',
  speechBubble: '今天感觉怎么样？',
  statusText: '距离你上次来聊天，已经 3 天了',
  primaryActionLabel: '现在想说点什么',
  quickActions: [
    { id: 'breathing', title: '呼吸\n练习', illustration: '🍃' },
    { id: 'goodnight', title: '晚安\n安抚', illustration: '🌙' },
  ],
};

export const CONVERSATION_DATA: ConversationData = {
  title: '和憨憨熊聊天',
  memoryHint: '我记得你前几天提过，最近总觉得有点累',
  messages: [
    {
      id: 'user-1',
      role: 'user',
      text: '小熊，我今天有点喘不过气，工作压得我很累。',
      time: '上午 9:15',
    },
    {
      id: 'bear-1',
      role: 'companion',
      text:
        '哎呀，听到你这么说我有点心疼。我在这里陪着你，你愿意慢慢和我说说，今天都发生了什么吗？要不要先抱一下？',
    },
  ],
};

export const MEMORIES_DATA: MemoriesData = {
  title: '情绪记忆',
  nickname: '你的小名',
  relationshipLabels: ['刚认识', '熟悉了', '更亲近'],
  relationshipProgress: 0.56,
  cards: [
    {
      id: 'worries',
      title: '最近的烦恼',
      body: '最近总被工作压得喘不过气。\n和抱抱熊说过。\n（2 天前）',
      color: '#B5D464',
      rotation: '-6deg',
    },
    {
      id: 'quiet',
      title: '安静的一刻',
      body: '坐在星星树下发呆。\n那一刻很平静。\n（昨天）',
      color: '#DCCAF1',
      rotation: '8deg',
    },
    {
      id: 'topics',
      title: '最常聊的话题',
      body: '我们的小茶会仪式感。\n和小狐狸聊过。\n（上周）',
      color: '#F6C57F',
      rotation: '-4deg',
    },
    {
      id: 'growth',
      title: '学着慢慢听见自己',
      body: '谢谢你，绒绒。\n（3 天前）',
      color: '#F2B157',
      rotation: '-8deg',
    },
    {
      id: 'joy',
      title: '一起烤小饼干',
      body: '空气里都是笑声。\n（上个月）',
      color: '#C8E6A7',
      rotation: '-3deg',
    },
  ],
  footer: '这些记忆只会留在你和绒绒伙伴之间，不会随便被别人看到。',
};

export const PROFILE_DATA: ProfileData = {
  title: '我的森林档案',
  subtitle: '陪伴角色：料理猫',
  daysTogether: '一起走过：128 天',
  relationshipLevel: '关系阶段：小芽',
  bannerText: '升级后可以解锁更多森林里的陪伴内容',
  menuItems: [
    { id: 'account', label: '账号：[Apple ID] 已绑定', icon: 'person-outline' },
    { id: 'privacy', label: '隐私与记忆管理', icon: 'lock-closed-outline' },
    { id: 'support', label: '支持与反馈', icon: 'help-circle-outline' },
    { id: 'settings', label: '设置', icon: 'settings-outline' },
  ],
  footerTitle: '绑定账号后，记忆会更稳地留下来。',
  footerBody: '点一下，把你的树洞好好收起来。',
};
