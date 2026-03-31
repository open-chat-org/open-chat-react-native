import {
  CaretLeft,
  CaretRight,
  ChatCircleDots,
  Copy,
  DotsThreeOutline,
  DownloadSimple,
  GearSix,
  Key,
  Microphone,
  PaperPlaneTilt,
  Phone,
  Plus,
  UserCircle,
  VideoCamera,
  type Icon,
  type IconProps,
  type IconWeight,
} from 'phosphor-react-native';
import { AppIconName } from '../types/icon.types';

type AppIconProps = {
  color: string;
  name: AppIconName;
  size?: number;
  style?: IconProps['style'];
  weight?: IconWeight;
};

const icon_map: Record<AppIconName, Icon> = {
  'caret-left': CaretLeft,
  'caret-right': CaretRight,
  'chat-circle-dots': ChatCircleDots,
  copy: Copy,
  'dots-three-outline': DotsThreeOutline,
  'download-simple': DownloadSimple,
  'gear-six': GearSix,
  key: Key,
  microphone: Microphone,
  'paper-plane-tilt': PaperPlaneTilt,
  phone: Phone,
  plus: Plus,
  'user-circle': UserCircle,
  'video-camera': VideoCamera,
};

export type { AppIconName } from '../types/icon.types';
export type { IconWeight } from 'phosphor-react-native';

export function AppIcon({
  color,
  name,
  size = 20,
  style,
  weight = 'regular',
}: AppIconProps) {
  const IconComponent = icon_map[name];

  return (
    <IconComponent
      color={color}
      size={size}
      style={style}
      weight={weight}
    />
  );
}
