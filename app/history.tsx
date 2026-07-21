import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Syft } from '@/constants/theme';

const leafIcon = require('@/assets/images/leaf.png');
const achievementIcon = require('@/assets/images/achievement.png');
const trashcanIcon = require('@/assets/images/trashcan.png');

// Mock history — replaced with real sorting data later.
const HISTORY = [
  { id: '1', icon: leafIcon, title: 'Can Recycled', detail: 'Aluminum can', time: '5 min ago' },
  { id: '2', icon: leafIcon, title: 'Bottle Recycled', detail: 'Plastic bottle', time: '22 min ago' },
  { id: '3', icon: achievementIcon, title: 'Achievement Unlocked', detail: 'Saved 100 lbs', time: 'Yesterday 10:01 AM' },
  { id: '4', icon: trashcanIcon, title: 'Waste Sorted', detail: 'Food wrapper → Trash', time: 'Yesterday 9:14 AM' },
  { id: '5', icon: leafIcon, title: 'Paper Recycled', detail: 'Cardboard box', time: 'Wednesday 6:40 PM' },
  { id: '6', icon: trashcanIcon, title: 'Waste Emptied', detail: 'Bin emptied', time: 'Wednesday 8:20 PM' },
  { id: '7', icon: leafIcon, title: 'Glass Recycled', detail: 'Glass jar', time: 'Tuesday 1:12 PM' },
  { id: '8', icon: achievementIcon, title: 'Streak Extended', detail: '7 days recycling', time: 'Monday 8:00 AM' },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });

  if (!fontsLoaded) {
    return <View style={styles.outer} />;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={[styles.backButton, { top: insets.top + 10 }]}
            hitSlop={12}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={Syft.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Recycling History</Text>
        </View>

        <FlatList
          data={HISTORY}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>240</Text>
                <Text style={styles.statLabel}>Items recycled</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>100 lbs</Text>
                <Text style={styles.statLabel}>Saved this month</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Image source={item.icon} style={styles.icon} contentFit="contain" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.rowTime}>{item.time}</Text>
            </View>
          )}
        />
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
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Syft.lime,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  statNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Syft.white,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Syft.white,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eceee4',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Syft.darkOlive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    width: 26,
    height: 26,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Syft.brown,
    marginBottom: 2,
  },
  rowDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8a8f7a',
  },
  rowTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#9aa08a',
    marginLeft: 8,
  },
});
