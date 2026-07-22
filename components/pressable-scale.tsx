import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Motion } from '@/constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** How far to scale down while pressed (1 = no scale). */
  scaleTo?: number;
  /** Fire a light haptic tap on press (iOS only). */
  haptic?: boolean;
};

/**
 * A Pressable that springs down + dims slightly when held and gives a light
 * haptic tap on release. This replaces ad-hoc `opacity` press states so every
 * tappable thing in the app reacts the same way.
 *
 * For an entrance animation, wrap this in an `<Animated.View entering={enter(i)}>`
 * rather than putting `entering` here — the press transform lives on this node,
 * the entrance lives on the wrapper, so the two never fight over the same style.
 */
export function PressableScale({
  style,
  scaleTo = Motion.pressScale,
  haptic = true,
  onPress,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
    opacity: 1 - pressed.value * 0.12,
  }));

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        pressed.value = withSpring(1, Motion.pressSpring);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withSpring(0, Motion.pressSpring);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}>
      {children}
    </AnimatedPressable>
  );
}
