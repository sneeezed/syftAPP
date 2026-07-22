import React from 'react';
import { Text, type TextProps, View, type ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

// Helper components that render Animated.View/Text with `entering` animations ONLY
// while `intro` is true (initial app launch). Once `intro` turns false, they render
// standard View/Text elements so Reanimated native layout listeners are completely
// detached and cannot re-trigger when returning from screens/modals.

type EntryViewProps = ViewProps & {
  intro?: boolean;
  entering?: any;
};

export function EntryView({ intro, entering, children, style, ...props }: EntryViewProps) {
  if (intro && entering) {
    return (
      <Animated.View entering={entering} style={style} {...props}>
        {children}
      </Animated.View>
    );
  }
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

type EntryTextProps = TextProps & {
  intro?: boolean;
  entering?: any;
};

export function EntryText({ intro, entering, children, style, ...props }: EntryTextProps) {
  if (intro && entering) {
    return (
      <Animated.Text entering={entering} style={style} {...props}>
        {children}
      </Animated.Text>
    );
  }
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
}
