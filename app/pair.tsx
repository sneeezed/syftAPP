import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/pressable-scale';
import { Syft } from '@/constants/theme';
import { usePairing } from '@/hooks/use-pairing';
import { useSyft } from '@/hooks/use-syft';

export default function PairScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPaired } = usePairing();
  const { deviceUrl, connected, connecting, error, location, available, connect, changeLocation } =
    useSyft();
  const [address, setAddress] = useState(deviceUrl);

  const onFinish = () => {
    setPaired(true);
    router.back();
  };

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
          <Text style={styles.headerTitle}>Set up your Syft</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Step 1 — connect to the Pi */}
          <Text style={styles.stepLabel}>1 · Connect</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Trashcan address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholder="http://raspberrypi.local:8000"
              placeholderTextColor="#a7ad97"
              editable={!connecting}
            />
            <Text style={styles.hint}>
              Your Syft and this phone must be on the same Wi-Fi. Use the address shown in the
              trashcan’s console when it starts up.
            </Text>

            <PressableScale
              style={[styles.button, connected && styles.buttonDone]}
              onPress={() => connect(address)}
              disabled={connecting}>
              {connecting ? (
                <ActivityIndicator color={Syft.white} />
              ) : (
                <View style={styles.buttonInner}>
                  <Ionicons
                    name={connected ? 'checkmark-circle' : 'wifi'}
                    size={20}
                    color={Syft.white}
                  />
                  <Text style={styles.buttonText}>{connected ? 'Reconnect' : 'Connect'}</Text>
                </View>
              )}
            </PressableScale>

            {connected && (
              <View style={styles.statusOk}>
                <Ionicons name="checkmark-circle" size={18} color={Syft.darkOlive} />
                <Text style={styles.statusOkText}>Connected to your Syft</Text>
              </View>
            )}
            {!!error && (
              <View style={styles.statusErr}>
                <Ionicons name="alert-circle" size={18} color="#b3261e" />
                <Text style={styles.statusErrText}>{error}</Text>
              </View>
            )}
          </View>

          {/* Step 2 — pick the recycling location */}
          <Text style={[styles.stepLabel, !connected && styles.stepDisabled]}>
            2 · Recycling location
          </Text>
          <View style={[styles.card, !connected && styles.cardDisabled]}>
            <Text style={styles.fieldLabel}>The rules your Syft follows when it sorts.</Text>
            {available.map((loc, i) => {
              const selected = loc === location;
              return (
                <PressableScale
                  key={loc}
                  style={[styles.locRow, i < available.length - 1 && styles.rowBorder]}
                  disabled={!connected}
                  onPress={() => changeLocation(loc)}>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selected ? Syft.darkOlive : '#b7bda8'}
                  />
                  <Text style={styles.locText}>{loc}</Text>
                </PressableScale>
              );
            })}
          </View>

          <PressableScale
            style={[styles.finish, !connected && styles.finishDisabled]}
            disabled={!connected}
            onPress={onFinish}>
            <Text style={styles.finishText}>Finish setup</Text>
          </PressableScale>
        </ScrollView>
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
  stepLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Syft.brown,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 4,
  },
  stepDisabled: {
    color: '#b3b8a5',
  },
  card: {
    backgroundColor: Syft.white,
    borderRadius: 16,
    padding: 16,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Syft.brown,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Syft.brown,
    backgroundColor: '#f4f6ee',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e3d6',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  hint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8a8f7a',
    lineHeight: 17,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Syft.darkOlive,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 14,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDone: {
    backgroundColor: Syft.lime,
  },
  buttonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Syft.white,
  },
  statusOk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  statusOkText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Syft.darkOlive,
  },
  statusErr: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
  },
  statusErrText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#b3261e',
    lineHeight: 18,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eceee4',
  },
  locText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Syft.brown,
  },
  finish: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Syft.brown,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 28,
  },
  finishDisabled: {
    opacity: 0.4,
  },
  finishText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Syft.white,
  },
});
