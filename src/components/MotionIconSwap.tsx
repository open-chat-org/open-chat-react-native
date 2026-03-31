import { Box } from 'native-base';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { AppIcon, AppIconName, IconWeight } from './AppIcon';

type MotionIconSwapProps = {
  active: boolean;
  color: string;
  from_icon_name: AppIconName;
  from_icon_weight?: IconWeight;
  size?: number;
  to_icon_name: AppIconName;
  to_icon_weight?: IconWeight;
};

export function MotionIconSwap({
  active,
  color,
  from_icon_name,
  from_icon_weight = 'regular',
  size = 20,
  to_icon_name,
  to_icon_weight = 'fill',
}: MotionIconSwapProps) {
  const swap_progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(swap_progress, {
      duration: 170,
      easing: Easing.out(Easing.quad),
      toValue: active ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [active, swap_progress]);

  const from_opacity = swap_progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const from_scale = swap_progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82],
  });
  const to_opacity = swap_progress;
  const to_scale = swap_progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  return (
    <Box
      alignItems="center"
      h={`${size}px`}
      justifyContent="center"
      w={`${size}px`}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.icon_layer,
          {
            opacity: from_opacity,
            transform: [{ scale: from_scale }],
          },
        ]}
      >
        <AppIcon
          color={color}
          name={from_icon_name}
          size={size}
          weight={from_icon_weight}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.icon_layer,
          {
            opacity: to_opacity,
            transform: [{ scale: to_scale }],
          },
        ]}
      >
        <AppIcon
          color={color}
          name={to_icon_name}
          size={size}
          weight={to_icon_weight}
        />
      </Animated.View>
    </Box>
  );
}

const styles = StyleSheet.create({
  icon_layer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
