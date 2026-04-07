import { theme } from '@/constants/theme';

import heroPinkLottie from '../../../../assets/lottie/hero-pink.lottie';
import rongLottie from '../../../../assets/lottie/rong.lottie';

export type Companion = {
  id: string;
  name: string;
  englishName: string;
  description: string;
  animationSource: typeof heroPinkLottie;
  tags: {
    id: string;
    label: string;
    backgroundColor: string;
    textColor: string;
  }[];
  placeholderLabel?: string;
};

export const companions: Companion[] = [
  {
    id: 'pinky-main',
    name: '粉粉',
    englishName: 'PINKY',
    description:
      '像棉花糖一样软乎乎，也像晚霞一样有温度。粉粉会先抱住你的情绪，再慢慢陪你把心里的结打开。你想安静地待一会儿，它会陪你坐着；你想说一大串心事，它也会耐心听完。',
    animationSource: heroPinkLottie,
    tags: [
      {
        id: 'soft',
        label: '软萌\n陪伴',
        backgroundColor: theme.colors.cream,
        textColor: '#7F6722',
      },
      {
        id: 'warm',
        label: '甜甜\n安抚感',
        backgroundColor: theme.colors.mint,
        textColor: '#3F7D66',
      },
    ],
  },
  {
    id: 'rong-main',
    name: '绒绒',
    englishName: 'RONG',
    description:
      '绒绒先用新的动物素材登场。这一位会更安静一些，更适合你想慢慢说、慢慢被接住的时候。后面你如果还要补它的人设和语气，我再继续往细里收。',
    animationSource: rongLottie,
    tags: [
      {
        id: 'light',
        label: '轻盈\n陪伴',
        backgroundColor: '#FDEDC5',
        textColor: '#7B6527',
      },
      {
        id: 'calm',
        label: '甜甜\n缓冲感',
        backgroundColor: '#DBF0E7',
        textColor: '#3D7A67',
      },
    ],
  },
];

export const swipeThreshold = 92;

export function wrapIndex(index: number) {
  const length = companions.length;
  return ((index % length) + length) % length;
}
