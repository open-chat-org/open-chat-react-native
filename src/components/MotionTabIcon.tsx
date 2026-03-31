import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AppIcon, AppIconName } from './AppIcon';

type MotionTabIconProps = {
  active: boolean;
  active_color: string;
  inactive_color: string;
  name: AppIconName;
  size?: number;
};

export function MotionTabIcon({
  active,
  active_color,
  inactive_color,
  name,
  size = 20,
}: MotionTabIconProps) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 180,
      easing: Easing.out(Easing.quad),
      toValue: active ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.06],
  });
  const translate_y = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -1],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ scale }, { translateY: translate_y }],
      }}
    >
      <AppIcon
        color={active ? active_color : inactive_color}
        name={name}
        size={size}
        weight={active ? 'fill' : 'regular'}
      />
    </Animated.View>
  );
}
