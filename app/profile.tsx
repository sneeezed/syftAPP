import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Syft } from '@/constants/theme';

// Mock profile data — replaced with real account data later.
const INITIAL = {
  name: 'Hannah',
  email: 'hannah@example.com',
};

const NOTIFICATIONS = [
  { key: 'binFull', label: 'Bin full alerts', hint: 'When your Syft is almost full' },
  { key: 'sortErrors', label: 'Sorting mistakes', hint: 'When an item may be sorted wrong' },
  { key: 'tips', label: 'Achievements & tips', hint: 'Milestones and recycling tips' },
] as const;

type NotificationKey = (typeof NOTIFICATIONS)[number]['key'];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });

  const [name, setName] = useState(INITIAL.name);
  const [email, setEmail] = useState(INITIAL.email);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    binFull: true,
    sortErrors: true,
    tips: false,
  });
  const [saved, setSaved] = useState(false);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const toggle = (key: NotificationKey) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSave = () => {
    // Mock save — wire to a real backend later.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!fontsLoaded) {
    return <View style={styles.outer} />;
  }

  return (
    <View style={styles.outer}>
      <View style={styles.root}>
        {/* Green header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable
            style={[styles.backButton, { top: insets.top + 10 }]}
            hitSlop={12}
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={Syft.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.avatarWrap}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={54} color={Syft.white} />
              </View>
            )}
            <Pressable style={styles.cameraBadge} hitSlop={8} onPress={pickPhoto}>
              <Ionicons name="camera" size={18} color={Syft.white} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#9aa08a"
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9aa08a"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Notifications */}
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.notifCard}>
            {NOTIFICATIONS.map((item, index) => (
              <View
                key={item.key}
                style={[styles.notifRow, index > 0 && styles.notifRowBorder]}>
                <View style={styles.notifText}>
                  <Text style={styles.notifLabel}>{item.label}</Text>
                  <Text style={styles.notifHint}>{item.hint}</Text>
                </View>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={() => toggle(item.key)}
                  trackColor={{ false: '#cfcfcf', true: Syft.lime }}
                  thumbColor={Syft.white}
                />
              </View>
            ))}
          </View>

          {/* Save */}
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
            onPress={onSave}>
            <Text style={styles.saveButtonText}>{saved ? 'Saved!' : 'Save Changes'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 110;

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
    backgroundColor: Syft.lime,
    alignItems: 'center',
    paddingBottom: AVATAR_SIZE / 2 + 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
  avatarWrap: {
    position: 'absolute',
    bottom: -AVATAR_SIZE / 2,
    alignSelf: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 5,
    borderColor: Syft.white,
    backgroundColor: Syft.darkOlive,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Syft.darkOlive,
    borderWidth: 3,
    borderColor: Syft.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: AVATAR_SIZE / 2 + 24,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Syft.brown,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e2d8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Syft.brown,
    backgroundColor: '#fafbf7',
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Syft.brown,
    marginTop: 28,
    marginBottom: 12,
  },
  notifCard: {
    backgroundColor: '#f4f6ee',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  notifRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#e2e5d8',
  },
  notifText: {
    flex: 1,
    paddingRight: 12,
  },
  notifLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Syft.brown,
    marginBottom: 2,
  },
  notifHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8a8f7a',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: Syft.darkOlive,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Syft.white,
  },
});
