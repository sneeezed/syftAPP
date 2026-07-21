import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold_Italic } from '@expo-google-fonts/playfair-display';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Syft } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const backgroundImage = require('@/assets/images/background.png');
const leafIcon = require('@/assets/images/leaf.png');
const achievementIcon = require('@/assets/images/achievement.png');
const trashcanIcon = require('@/assets/images/trashcan.png');

// Mock data — swapped for real trashcan data later.
const fullnessPercent = 58;

const activity = [
  {
    icon: leafIcon,
    title: 'Can Recycled',
    subtitle: 'Open to see recent sorted Items - 5 min ago',
  },
  {
    icon: achievementIcon,
    title: 'Achievement Unlocked',
    subtitle: 'Saved 100lbs - Yesterday 10:01 AM',
  },
  {
    icon: trashcanIcon,
    title: 'Waste Emptied',
    subtitle: 'Wednesday 8:20 PM',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold_Italic,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  useEffect(() => {
    if (fontsLoaded) {
      progress.value = withDelay(
        300,
        withTiming(fullnessPercent, { duration: 1200, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [fontsLoaded, progress]);

  if (!fontsLoaded) {
    return <View style={styles.outer} />;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Forest header with hamburger menu */}
        <View style={styles.header}>
          <Image
            source={backgroundImage}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
          />
          <Pressable
            style={[styles.menuButton, { top: insets.top + 8 }]}
            hitSlop={12}
            onPress={() => router.push('/menu')}>
            <Ionicons name="menu" size={34} color={Syft.white} />
          </Pressable>
        </View>

        {/* White arched sheet that holds the rest of the screen */}
        <View style={styles.sheet}>
          {/* Avatar straddling the forest and the sheet — tap to edit profile */}
          <View style={styles.avatarWrap}>
            <Pressable onPress={() => router.push('/profile')}>
              <View style={styles.avatar} />
            </Pressable>
          </View>

          {/* Equal spacers above and below center the welcome text in the white area */}
          <View style={styles.spacer} />

          <Animated.Text entering={FadeIn.duration(800)} style={styles.welcome}>
            Welcome Back Hannah!
          </Animated.Text>

          <View style={styles.spacer} />

          {/* Fill status */}
          <Animated.Text entering={FadeInDown.duration(500).delay(100)} style={styles.sectionTitle}>
            Fill Status
          </Animated.Text>
          <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.fullnessCard}>
            <View style={styles.fullnessTopRow}>
              <Ionicons name="trash-outline" size={34} color={Syft.white} />
              <Text style={styles.fullnessPercent}>{fullnessPercent}% Full</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
          </Animated.View>

          {/* Recent Activity */}
          <Animated.Text entering={FadeInDown.duration(500).delay(250)} style={styles.sectionTitle}>
            Recent Activity
          </Animated.Text>
          <View style={styles.activityCard}>
            {activity.map((item, index) => (
              <AnimatedPressable
                key={item.title}
                entering={FadeInDown.duration(450).delay(350 + index * 120)}
                onPress={() => router.push('/history')}
                style={[styles.activityRow, index > 0 && styles.activityRowBorder]}>
                <View style={styles.activityIconCircle}>
                  <Image source={item.icon} style={styles.activityIcon} contentFit="contain" />
                </View>
                <View style={styles.activityText}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Syft.white} />
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </ScrollView>

        {/* Bottom bar with settings gear */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
          <Pressable hitSlop={12} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-sharp" size={30} color={Syft.lime} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 150;

const styles = StyleSheet.create({
  // Centers the app and greys the margins when the window is wider than a phone (web).
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d8d8d8',
  },
  root: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: Syft.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 75,
  },
  header: {
    height: 260,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
  },
  sheet: {
    flex: 1,
    marginTop: -80,
    backgroundColor: Syft.white,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    paddingHorizontal: 24,
    paddingTop: AVATAR_SIZE / 2 + 12,
    minHeight: 500,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
  avatarWrap: {
    position: 'absolute',
    top: -AVATAR_SIZE / 2,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Syft.lime,
    borderWidth: 8,
    borderColor: Syft.white,
  },
  welcome: {
    fontSize: 28,
    color: Syft.brown,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_600SemiBold_Italic',
  },
  fullnessCard: {
    backgroundColor: Syft.lime,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  fullnessTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fullnessPercent: {
    fontSize: 22,
    color: Syft.white,
    fontFamily: 'Inter_700Bold',
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Syft.white,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: Syft.brown,
  },
  sectionTitle: {
    fontSize: 18,
    color: Syft.brown,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  activityCard: {
    backgroundColor: Syft.darkOlive,
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  activityRowBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  activityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Syft.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityIcon: {
    width: 28,
    height: 28,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    color: Syft.white,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Syft.offWhite,
    paddingTop: 12,
    paddingHorizontal: 26,
    alignItems: 'flex-end',
  },
});
