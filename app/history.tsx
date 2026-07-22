import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntryView } from '@/components/animated-entry';
import { PressableScale } from '@/components/pressable-scale';
import { enter } from '@/constants/motion';
import { bucketVerb, itemTitle, relativeTime, type Bucket } from '@/constants/syft';
import { Syft } from '@/constants/theme';
import { useIntro } from '@/hooks/use-intro';
import { useSyft } from '@/hooks/use-syft';

const BUCKET_ICON: Record<Bucket, keyof typeof Ionicons.glyphMap> = {
  recycle: 'leaf',
  trash: 'trash',
  ewaste: 'warning',
};

const BUCKET_COLOR: Record<Bucket, string> = {
  recycle: Syft.lime,
  trash: Syft.darkOlive,
  ewaste: '#b3261e',
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const intro = useIntro('history');
  const { stats, recent, refresh } = useSyft();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
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
          <Text style={styles.headerTitle}>Recycling History</Text>
        </View>

        <FlatList
          data={recent}
          keyExtractor={(item, index) => `${item.ts}-${index}`}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <EntryView intro={intro} entering={enter(0)} style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats?.recycled_items ?? 0}</Text>
                <Text style={styles.statLabel}>Items recycled</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{(stats?.recycled_weight_lbs ?? 0).toFixed(1)} lbs</Text>
                <Text style={styles.statLabel}>Diverted from landfill</Text>
              </View>
            </EntryView>
          }
          ListEmptyComponent={
            <EntryView intro={intro} entering={enter(1)} style={styles.empty}>
              <Ionicons name="sparkles-outline" size={30} color={Syft.lime} />
              <Text style={styles.emptyTitle}>No sorting history yet</Text>
              <Text style={styles.emptySub}>Items your Syft sorts will show up here.</Text>
            </EntryView>
          }
          renderItem={({ item, index }) => (
            <EntryView intro={intro} entering={enter(Math.min(index + 1, 8))} style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: BUCKET_COLOR[item.bucket] }]}>
                <Ionicons name={BUCKET_ICON[item.bucket]} size={22} color={Syft.white} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{itemTitle(item.item)}</Text>
                <Text style={styles.rowDetail}>
                  {bucketVerb(item.bucket)}
                  {item.weight_g ? ` · ~${(item.weight_g / 453.592).toFixed(2)} lb` : ''}
                </Text>
              </View>
              <Text style={styles.rowTime}>{relativeTime(item.ts)}</Text>
            </EntryView>
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
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Syft.brown,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#8a8f7a',
    textAlign: 'center',
    lineHeight: 19,
  },
});
