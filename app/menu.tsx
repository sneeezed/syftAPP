import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Syft } from '@/constants/theme';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: Href;
  soon?: boolean;
};

const ITEMS: MenuItem[] = [
  { icon: 'person-outline', label: 'Profile', route: '/profile' },
  { icon: 'time-outline', label: 'Recycling History', route: '/history' },
  { icon: 'add-circle-outline', label: 'Pair a Trashcan', soon: true },
  { icon: 'star-outline', label: 'Subscription', soon: true },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
  { icon: 'log-out-outline', label: 'Sign Out', soon: true },
];

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const onPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    } else {
      showToast(`${item.label} is coming soon`);
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.outer} />;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={[styles.backButton, { top: insets.top + 10 }]}
            hitSlop={12}
            onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Syft.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}>
          {ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => onPress(item)}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={22} color={Syft.white} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#b7bda8" />
            </Pressable>
          ))}
        </ScrollView>

        {toast && (
          <View style={[styles.toast, { bottom: insets.bottom + 24 }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
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
    backgroundColor: Syft.white,
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
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eceee4',
  },
  rowPressed: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Syft.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowLabel: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Syft.brown,
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
