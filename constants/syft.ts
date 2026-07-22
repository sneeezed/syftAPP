/**
 * Talking to a Syft trashcan — the Raspberry Pi running live.py, which serves an
 * HTTP API on port 8000 over your local network:
 *   GET  /config  -> { location, available }
 *   POST /config  { location }  -> { ok, location }
 *   GET  /status  -> live sorting state
 */

// The fixed list of vetted recycling locations the app offers. Mirrors LOCATIONS
// in the Pi's classify.py. Philadelphia only for now — add vetted cities here and
// in classify.py together.
export const LOCATIONS = ['Philadelphia, PA'] as const;

// Prefilled address of your Pi for the demo. Use its mDNS hostname or its LAN IP
// (e.g. 'http://10.103.210.108:8000'). NOTE: inside the app 'localhost' means the
// phone/browser itself, never the Pi — always use the Pi's network address.
export const DEFAULT_DEVICE_URL = 'http://raspberrypi.local:8000';

/** Turn whatever the user typed into a usable base URL (adds http://, trims trailing /). */
export function normalizeDeviceUrl(input: string): string {
  const url = input.trim();
  if (!url) return '';
  const withScheme = /^https?:\/\//i.test(url) ? url : `http://${url}`;
  return withScheme.replace(/\/+$/, '');
}
