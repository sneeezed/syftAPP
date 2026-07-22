import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryText, EntryView } from '@/components/animated-entry';
import { PressableScale } from '@/components/pressable-scale';
import { enter } from '@/constants/motion';
import { Syft } from '@/constants/theme';
import { useIntro } from '@/hooks/use-intro';
import { usePairing } from '@/hooks/use-pairing';

type LinkRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: Href;
  soon?: boolean;
  danger?: boolean;
};

const ABOUT_ROWS: LinkRow[] = [
  { icon: 'help-circle-outline', label: 'Help & Support', soon: true },
  { icon: 'document-text-outline', label: 'Terms & Privacy', soon: true },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const intro = useIntro('settings');
  const { paired, setPaired } = usePairing();
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [metricUnits, setMetricUnits] = useState(true);

  const accountRows: LinkRow[] = [
    { icon: 'person-outline', label: 'Edit Profile', route: '/profile' },
    { icon: 'time-outline', label: 'Recycling History', route: '/history' },
    { icon: 'star-outline', label: 'Manage Subscription', soon: true },
    {
      icon: 'add-circle-outline',
      label: paired ? 'Pair a new trashcan' : 'Pair a Trashcan',
      soon: true,
    },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const onPressRow = (row: LinkRow) => {
    if (row.route) {
      router.push(row.route);
    } else {
      showToast(`${row.label} is coming soon`);
    }
  };

  const renderLinkRow = (row: LinkRow, index: number, total: number) => (
    <PressableScale
      key={row.label}
      style={[styles.row, index < total - 1 && styles.rowBorder]}
      onPress={() => onPressRow(row)}>
      <Ionicons name={row.icon} size={22} color={row.danger ? '#b3261e' : Syft.darkOlive} />
      <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>{row.label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#b7bda8" />
    </PressableScale>
  );

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <PressableScale
            style={[styles.backButton, { top: insets.top + 10 }]}
            hitSlop={12}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={Syft.white} />
          </PressableScale>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}>
          <EntryView intro={intro} entering={enter(0)}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              {accountRows.map((r, i) => renderLinkRow(r, i, accountRows.length))}
            </View>
          </EntryView>

          <EntryView intro={intro} entering={enter(1)}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <View style={[styles.row, styles.rowBorder]}>
                <Ionicons name="moon-outline" size={22} color={Syft.darkOlive} />
                <Text style={styles.rowLabel}>Dark mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#cfcfcf', true: Syft.lime }}
                  thumbColor={Syft.white}
                />
              </View>
              <View style={[styles.row, styles.rowBorder]}>
                <Ionicons name="speedometer-outline" size={22} color={Syft.darkOlive} />
                <Text style={styles.rowLabel}>Use metric units (kg)</Text>
                <Switch
                  value={metricUnits}
                  onValueChange={setMetricUnits}
                  trackColor={{ false: '#cfcfcf', true: Syft.lime }}
                  thumbColor={Syft.white}
                />
              </View>
              {/* Demo-only: flip between the paired dashboard and the pairing screen. */}
              <View style={styles.row}>
                <Ionicons name="hardware-chip-outline" size={22} color={Syft.darkOlive} />
                <Text style={styles.rowLabel}>Paired with trashcan</Text>
                <Switch
                  value={paired}
                  onValueChange={setPaired}
                  trackColor={{ false: '#cfcfcf', true: Syft.lime }}
                  thumbColor={Syft.white}
                />
              </View>
            </View>
          </EntryView>

          <EntryView intro={intro} entering={enter(2)}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              {ABOUT_ROWS.map((r, i) => renderLinkRow(r, i, ABOUT_ROWS.length))}
            </View>
          </EntryView>

          <EntryView intro={intro} entering={enter(3)}>
            <PressableScale
              style={styles.signOut}
              onPress={() => showToast('Sign out is coming soon')}>
              <Ionicons name="log-out-outline" size={22} color="#b3261e" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </PressableScale>
          </EntryView>

          <EntryText intro={intro} entering={enter(4)} style={styles.version}>
            Syft v1.0.0
          </EntryText>
        </ScrollView>

        {toast && (
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(180)}
            style={[styles.toast, { bottom: insets.bottom + 24 }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#f4f6ee',
  },
  header: {
    backgroundColor: Syft.darkOlive,
    alignItems: 'center',
    paddingBottom: 18,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Syft.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Syft.brown,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Syft.white,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eceee4',
  },
  rowLabel: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Syft.brown,
  },
  rowLabelDanger: {
    color: '#b3261e',
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    paddingVertical: 15,
    backgroundColor: Syft.white,
    borderRadius: 16,
  },
  signOutText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: '#b3261e',
  },
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#9aa08a',
    textAlign: 'center',
    marginTop: 20,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Syft.brown,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  toastText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Syft.white,
  },
});
