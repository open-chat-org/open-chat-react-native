import { Box } from 'native-base';
import { ReactNode, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { AppIcon, AppIconName, IconWeight } from './AppIcon';

type MotionIconButtonProps = {
  accessibility_label?: string;
  bg: string;
  border_color?: string;
  border_width?: number;
  children?: ReactNode;
  disabled?: boolean;
  h?: number | string;
  hit_slop?: Insets;
  icon_color?: string;
  icon_name?: AppIconName;
  icon_size?: number;
  icon_weight?: IconWeight;
  on_press?: () => void;
  px?: number;
  rounded?: string;
  shadow?: number;
  size?: number | string;
  style?: StyleProp<ViewStyle>;
  w?: number | string;
};

function to_native_base_size(value?: number | string) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
}

export function MotionIconButton({
  accessibility_label,
  bg,
  border_color,
  border_width,
  children,
  disabled = false,
  h,
  hit_slop,
  icon_color,
  icon_name,
  icon_size = 20,
  icon_weight = 'regular',
  on_press,
  px = 0,
  rounded = 'full',
  shadow = 0,
  size = 40,
  style,
  w,
}: MotionIconButtonProps) {
  const scale_animation = useRef(new Animated.Value(1)).current;
  const opacity_animation = useRef(new Animated.Value(1)).current;
  const resolved_height = to_native_base_size(h ?? size);
  const resolved_width = to_native_base_size(w ?? size);

  const animate_to = (next_scale: number, next_opacity: number) => {
    Animated.parallel([
      Animated.spring(scale_animation, {
        damping: 12,
        mass: 0.7,
        stiffness: 260,
        toValue: next_scale,
        useNativeDriver: true,
        velocity: 0.5,
      }),
      Animated.timing(opacity_animation, {
        duration: 140,
        easing: Easing.out(Easing.quad),
        toValue: next_opacity,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      accessibilityLabel={accessibility_label}
      disabled={disabled}
      hitSlop={hit_slop}
      onPress={on_press}
      onPressIn={() => {
        if (!disabled) {
          animate_to(0.94, 0.92);
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          animate_to(1, 1);
        }
      }}
    >
      <Animated.View
        style={[
          styles.wrapper,
          {
            opacity: opacity_animation,
            transform: [{ scale: scale_animation }],
          },
          style,
        ]}
      >
        <Box
          alignItems="center"
          justifyContent="center"
          bg={bg}
          borderColor={border_color}
          borderWidth={border_width ?? (border_color ? 1 : 0)}
          h={resolved_height}
          px={px}
          rounded={rounded}
          shadow={shadow}
          w={resolved_width}
        >
          {children ?? (icon_name && icon_color ? (
            <AppIcon
              color={icon_color}
              name={icon_name}
              size={icon_size}
              weight={icon_weight}
            />
          ) : null)}
        </Box>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
});
