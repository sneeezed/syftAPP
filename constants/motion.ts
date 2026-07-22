/**
 * Shared motion system.
 *
 * One place defines how the whole app moves so every screen feels like the same
 * app: the same easing curve, the same stagger rhythm, the same press spring.
 * Screens should reach for `enter()` / `pop()` for entrances and `PressableScale`
 * for taps rather than hand-rolling timings.
 */
import { Easing, FadeInDown, ZoomIn } from 'react-native-reanimated';

export const Motion = {
  duration: { fast: 200, base: 380, slow: 520 },
  /** Delay added per item in a staggered list (ms). */
  stagger: 65,
  /** The app's single easing curve — a gentle decelerate. */
  easing: Easing.out(Easing.cubic),
  /** Spring used for the press-in / press-out scale. Snappy, no overshoot. */
  pressSpring: { damping: 15, stiffness: 350, mass: 0.5 },
  /** How far a pressable scales down while held. */
  pressScale: 0.96,
};

/**
 * Standard content entrance: fade + rise. Pass the item's position to stagger a
 * cascade (0, 1, 2, …). Call it inline in JSX so a fresh instance is created each
 * mount: `entering={enter(2)}`.
 */
export function enter(index = 0, baseDelay = 40) {
  return FadeInDown.duration(Motion.duration.base)
    .delay(baseDelay + index * Motion.stagger)
    .easing(Motion.easing);
}

/** Focal "pop" entrance for hero elements like avatars. */
export function pop(delay = 0) {
  return ZoomIn.springify().damping(14).mass(0.7).delay(delay);
}
