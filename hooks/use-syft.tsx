import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEFAULT_DEVICE_URL, LOCATIONS, normalizeDeviceUrl } from '@/constants/syft';

type SyftContextValue = {
  /** Base URL of the paired Pi, e.g. http://raspberrypi.local:8000 */
  deviceUrl: string;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  /** Recycling location the Pi is currently using. */
  location: string | null;
  /** Locations the Pi offers (from GET /config). */
  available: string[];
  /** Ping the Pi at `url` (or the stored deviceUrl) and load its config. */
  connect: (url?: string) => Promise<boolean>;
  /** Push a new recycling location to the Pi (POST /config). */
  changeLocation: (location: string) => Promise<boolean>;
  disconnect: () => void;
};

const SyftContext = createContext<SyftContextValue | undefined>(undefined);

// Fail fast instead of hanging for 60s when the address is wrong or the Pi is off.
async function fetchJson(url: string, options?: RequestInit, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`device responded ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * App-wide connection to a Syft trashcan (the Pi). Holds the device address, the
 * live connection state, and the selected recycling location. Talks to the Pi's
 * HTTP API over the local network — see constants/syft.ts.
 */
export function SyftProvider({ children }: { children: ReactNode }) {
  const [deviceUrl, setDeviceUrl] = useState<string>(DEFAULT_DEVICE_URL);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [available, setAvailable] = useState<string[]>([...LOCATIONS]);

  const connect = useCallback(
    async (url?: string) => {
      const base = normalizeDeviceUrl(url ?? deviceUrl);
      if (!base) {
        setError('Enter your trashcan’s address first.');
        return false;
      }
      setConnecting(true);
      setError(null);
      try {
        const cfg = await fetchJson(`${base}/config`);
        setDeviceUrl(base);
        setLocation(typeof cfg.location === 'string' ? cfg.location : null);
        setAvailable(
          Array.isArray(cfg.available) && cfg.available.length ? cfg.available : [...LOCATIONS],
        );
        setConnected(true);
        return true;
      } catch (e: any) {
        setConnected(false);
        setError(
          e?.name === 'AbortError'
            ? 'Couldn’t reach the trashcan — check the address and that you’re on the same Wi-Fi.'
            : `Couldn’t connect: ${e?.message ?? e}`,
        );
        return false;
      } finally {
        setConnecting(false);
      }
    },
    [deviceUrl],
  );

  const changeLocation = useCallback(
    async (loc: string) => {
      setError(null);
      try {
        const res = await fetchJson(`${deviceUrl}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: loc }),
        });
        setLocation(typeof res.location === 'string' ? res.location : loc);
        return true;
      } catch (e: any) {
        setError(`Couldn’t save location: ${e?.message ?? e}`);
        return false;
      }
    },
    [deviceUrl],
  );

  const disconnect = useCallback(() => {
    setConnected(false);
    setLocation(null);
  }, []);

  const value = useMemo(
    () => ({
      deviceUrl,
      connected,
      connecting,
      error,
      location,
      available,
      connect,
      changeLocation,
      disconnect,
    }),
    [deviceUrl, connected, connecting, error, location, available, connect, changeLocation, disconnect],
  );

  return <SyftContext.Provider value={value}>{children}</SyftContext.Provider>;
}

export function useSyft() {
  const ctx = useContext(SyftContext);
  if (!ctx) {
    throw new Error('useSyft must be used within a SyftProvider');
  }
  return ctx;
}
