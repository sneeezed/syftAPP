import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryText, EntryView } from '@/components/animated-entry';
import { PressableScale } from '@/components/pressable-scale';
import { enter, pop } from '@/constants/motion';
import { bucketVerb, itemTitle, relativeTime, type Bucket } from '@/constants/syft';
import { Syft } from '@/constants/theme';
import { useIntro } from '@/hooks/use-intro';
import { usePairing } from '@/hooks/use-pairing';
import { useSyft } from '@/hooks/use-syft';

const backgroundImage = require('@/assets/images/background.png');
const trashcanIcon = require('@/assets/images/trashcan.png');

// TODO: wire to the signed-in user; hardcoded for the demo.
const userName = 'Hannah';

const BUCKET_ICON: Record<Bucket, keyof typeof Ionicons.glyphMap> = {
  recycle: 'leaf',
  trash: 'trash',
  ewaste: 'warning',
};

export default function HomeScreen() {
  const { paired } = usePairing();
  return paired ? <PairedHome /> : <UnpairedHome />;
}

// Shown until the user pairs a Syft trashcan. Reuses the forest header + arched
// sheet so it feels like the same Home, with a single call to action.
function UnpairedHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const intro = useIntro('home-unpaired');

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        {/* Forest header */}
        <View style={styles.header}>
          <Image
            source={backgroundImage}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
          />
          <PressableScale
            style={[styles.settingsButton, { top: insets.top + 8 }]}
            hitSlop={12}
            onPress={() => router.push('/settings')}>
            <Ionicons name="settings-sharp" size={28} color={Syft.white} />
          </PressableScale>
        </View>

        <View style={styles.sheet}>
          <View style={styles.unpairedContent}>
            <EntryView intro={intro} entering={pop(120)} style={styles.unpairedIconCircle}>
              <Image source={trashcanIcon} style={styles.unpairedIcon} contentFit="contain" />
            </EntryView>
            <EntryText intro={intro} entering={enter(0)} style={styles.unpairedTitle}>
              Pair your Syft
            </EntryText>
            <EntryText intro={intro} entering={enter(1)} style={styles.unpairedSubtitle}>
              Connect your Syft trashcan to start sorting waste automatically.
            </EntryText>
            <EntryView intro={intro} entering={enter(2)} style={styles.unpairedButtonWrap}>
              <PressableScale style={styles.pairButton} onPress={() => router.push('/pair')}>
                <Ionicons name="add-circle-outline" size={22} color={Syft.white} />
                <Text style={styles.pairButtonText}>Pair with Trashcan</Text>
              </PressableScale>
            </EntryView>
          </View>
        </View>
      </View>
    </View>
  );
}

function PairedHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { stats, recent, refresh } = useSyft();

  // Pull fresh data whenever Home is focused, and keep it live while it's open.
  useFocusEffect(
    useCallback(() => {
      refresh();
      const id = setInterval(refresh, 4000);
      return () => clearInterval(id);
    }, [refresh]),
  );

  // Play the entrance cascade only on the first open after a cold launch — not
  // every time we return to Home (e.g. dismissing the menu that sits over it).
  const intro = useIntro('home');

  const initial = (userName.trim()[0] ?? 'S').toUpperCase();
  const feed = recent.slice(0, 6);

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}>
          {/* Forest header with settings (top-right) */}
          <View style={styles.header}>
            <Image
              source={backgroundImage}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="top"
            />
            <PressableScale
              style={[styles.settingsButton, { top: insets.top + 8 }]}
              hitSlop={12}
              onPress={() => router.push('/settings')}>
              <Ionicons name="settings-sharp" size={28} color={Syft.white} />
            </PressableScale>
          </View>

          {/* White arched sheet that holds the rest of the screen */}
          <View style={styles.sheet}>
            {/* Monogram avatar straddling the forest and the sheet — tap to edit profile */}
            <View style={styles.avatarWrap}>
              <PressableScale onPress={() => router.push('/profile')}>
                <EntryView intro={intro} entering={pop(120)} style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{initial}</Text>
                </EntryView>
              </PressableScale>
            </View>

            <EntryText intro={intro} entering={enter(0)} style={styles.welcome}>
              Welcome Back {userName}!
            </EntryText>

            {/* Hero stat — items sorted so far */}
            <EntryView intro={intro} entering={enter(1)} style={styles.heroCard}>
              <Text style={styles.heroNumber}>{stats?.total_items ?? 0}</Text>
              <Text style={styles.heroLabel}>items sorted for you so far</Text>
            </EntryView>

            {/* Recently Sorted */}
            <EntryText intro={intro} entering={enter(2)} style={styles.sectionTitle}>
              Recently Sorted
            </EntryText>
            {feed.length === 0 ? (
              <EntryView intro={intro} entering={enter(3)} style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="sparkles-outline" size={26} color={Syft.white} />
                </View>
                <Text style={styles.emptyTitle}>Nothing sorted yet</Text>
                <Text style={styles.emptySub}>Drop something into your Syft — it’ll show up here.</Text>
              </EntryView>
            ) : (
              <View style={styles.activityCard}>
                {feed.map((item, index) => (
                  <EntryView key={`${item.ts}-${index}`} intro={intro} entering={enter(3 + index)}>
                    <PressableScale
                      onPress={() => router.push('/history')}
                      style={[styles.activityRow, index > 0 && styles.activityRowBorder]}>
                      <View style={styles.activityIconCircle}>
                        <Ionicons name={BUCKET_ICON[item.bucket]} size={24} color={Syft.white} />
                      </View>
                      <View style={styles.activityText}>
                        <Text style={styles.activityTitle}>{itemTitle(item.item)}</Text>
                        <Text style={styles.activitySubtitle}>
                          {bucketVerb(item.bucket)} · {relativeTime(item.ts)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Syft.white} />
                    </PressableScale>
                  </EntryView>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  },
  header: {
    height: 260,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 64,
    color: Syft.white,
  },
  welcome: {
    fontSize: 28,
    color: Syft.brown,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_600SemiBold_Italic',
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: Syft.lime,
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  heroNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 56,
    color: Syft.white,
    lineHeight: 60,
  },
  heroLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Syft.white,
    marginTop: 2,
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
  // Recently-sorted empty state
  emptyCard: {
    backgroundColor: Syft.darkOlive,
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Syft.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Syft.white,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 19,
  },
  // Unpaired empty state
  unpairedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 60,
  },
  unpairedIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Syft.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  unpairedIcon: {
    width: 64,
    height: 64,
  },
  unpairedTitle: {
    fontSize: 26,
    color: Syft.brown,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_600SemiBold_Italic',
    marginBottom: 10,
  },
  unpairedSubtitle: {
    fontSize: 15,
    color: '#8a8f7a',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  unpairedButtonWrap: {
    width: '100%',
    alignItems: 'center',
  },
  pairButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Syft.darkOlive,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  pairButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Syft.white,
  },
});
