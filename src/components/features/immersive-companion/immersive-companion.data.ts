import { MaterialCommunityIcons } from '@expo/vector-icons';

import heroPinkLottie from '../../../../assets/lottie/hero-pink.lottie';
import rongLottie from '../../../../assets/lottie/rong.lottie';

export type MessageType = 'greeting' | 'poke' | 'purr' | 'care' | 'mic';

export type MessageItem = {
  id: string;
  type: MessageType;
  text: string;
};

export type SoundPreset = {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  circleColor: string;
  pitch: number;
  rate: number;
  mouthSpeed: number;
};

export type QuickAction = {
  id: MessageType;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export type CompanionDefinition = {
  id: string;
  name: string;
  animationSource: typeof heroPinkLottie;
  stageTitle: string;
  stageHint: string;
  purrText: string;
  idleMessage: string;
  defaultPresetId: SoundPreset['id'];
  messagesByType: Record<MessageType, string[]>;
};

export const quickActions: QuickAction[] = [
  { id: 'greeting', label: '打招呼', icon: 'hand-wave-outline' },
  { id: 'care', label: '心情不好', icon: 'heart-broken-outline' },
  { id: 'mic', label: '张嘴说话', icon: 'microphone-outline' },
];

export const soundPresets: SoundPreset[] = [
  {
    id: 'marshmallow',
    label: '棉花糖',
    subtitle: '轻软一点，像抱着你说话',
    icon: 'cloud-outline',
    circleColor: '#FFB86A',
    pitch: 1.14,
    rate: 0.94,
    mouthSpeed: 190,
  },
  {
    id: 'moonlight',
    label: '月光枕头',
    subtitle: '更轻更慢，适合夜里安抚',
    icon: 'weather-night',
    circleColor: '#9AB7FF',
    pitch: 1.02,
    rate: 0.86,
    mouthSpeed: 230,
  },
  {
    id: 'forest',
    label: '森林诗人',
    subtitle: '清透一点，像树影里说话',
    icon: 'leaf',
    circleColor: '#7EDFB8',
    pitch: 1.08,
    rate: 0.98,
    mouthSpeed: 175,
  },
  {
    id: 'pudding',
    label: '布丁奶油',
    subtitle: '暖暖黏黏，甜一点也更亲近',
    icon: 'cup-outline',
    circleColor: '#FFD86A',
    pitch: 1.2,
    rate: 1.02,
    mouthSpeed: 165,
  },
];

const companions: Record<string, CompanionDefinition> = {
  'pinky-main': {
    id: 'pinky-main',
    name: '粉粉',
    animationSource: heroPinkLottie,
    stageTitle: '粉粉今天状态很好',
    stageHint: '点一下它会回嘴，轻轻抚摸它会打呼噜，下方还能切换说话感觉',
    purrText: '呼噜呼噜...',
    idleMessage: '我已经坐好了，等你开口。',
    defaultPresetId: 'marshmallow',
    messagesByType: {
      greeting: ['嗨，我来啦。今天想先从哪里开始说？', '我已经准备好陪你了，我们慢慢聊。'],
      poke: ['别戳我啦，我会害羞的。', '哎呀，轻一点，我还在认真看着你呢。'],
      purr: ['呼噜呼噜……这样摸摸我，好安心。', '我喜欢你这样轻轻地摸我，心都软下来了。'],
      care: ['你怎么了？要不要让我先听你说一小段。', '是不是心里有点沉？你可以把情绪放在我这里。'],
      mic: ['我张嘴啦，你说吧，我会认真回应你。', '你一开口，我就在听。慢慢说，不着急。'],
    },
  },
  'rong-main': {
    id: 'rong-main',
    name: '绒绒',
    animationSource: rongLottie,
    stageTitle: '绒绒正在安静陪你',
    stageHint: '轻碰一下它会低声回应，顺着它摸一摸会更放松，它会用更慢的节奏陪着你',
    purrText: '呜噜...',
    idleMessage: '绒绒已经安静趴好，你想说的时候它就在。',
    defaultPresetId: 'forest',
    messagesByType: {
      greeting: ['绒绒在这里。你不用急，想好了再慢慢开口。', '我先安静陪着你，等你愿意的时候再把心事给我。'],
      poke: ['我有在听，不用试探我，靠近一点就好。', '被你轻轻碰一下，我就把注意力都放到你这里了。'],
      purr: ['嗯……这样慢慢摸我就很好，我会一直待在这里。', '你的手一轻下来，我也跟着放松了。'],
      care: ['如果今天有点累，就先把最沉的那一件事放到我这里。', '不用一下子讲完整，你先说一句，我陪你把后面的慢慢接住。'],
      mic: ['你说吧，我会慢一点回你，把每句话都听清楚。', '现在轮到你开口了，我会安静听完，不打断你。'],
    },
  },
};

export function pickNextMessage(companion: CompanionDefinition, type: MessageType, count: number) {
  const list = companion.messagesByType[type];
  return list[count % list.length];
}

export function resolveCompanion(companionId?: string) {
  if (companionId && companionId in companions) {
    return companions[companionId];
  }

  return companions['pinky-main'];
}

export function resolvePresetId(presetId?: string, fallbackPresetId?: SoundPreset['id']) {
  if (presetId && soundPresets.some((preset) => preset.id === presetId)) {
    return presetId;
  }

  if (fallbackPresetId && soundPresets.some((preset) => preset.id === fallbackPresetId)) {
    return fallbackPresetId;
  }

  return soundPresets[0].id;
}
