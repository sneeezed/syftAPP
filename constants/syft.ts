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

// --- Sorting data the Pi reports (see live.py /history and /stats) ---

export type Bucket = 'recycle' | 'trash' | 'ewaste';

export type SortedItem = {
  ts: number; // unix seconds
  item: string;
  score: number;
  is_recycle: boolean;
  is_ewaste: boolean;
  bucket: Bucket;
  reason: string;
  engine: string;
  source: string;
  weight_g: number | null;
};

export type SyftStats = {
  total_items: number;
  recycled_items: number;
  trash_items: number;
  ewaste_items: number;
  total_weight_g: number;
  recycled_weight_g: number;
  total_weight_lbs: number;
  recycled_weight_lbs: number;
};

/** "just now" / "5 min ago" / "3 hr ago" / "2 d ago" from a unix-seconds timestamp. */
export function relativeTime(tsSeconds: number): string {
  const diff = Date.now() / 1000 - tsSeconds;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} d ago`;
}

/** Human label for what happened to an item. */
export function bucketVerb(bucket: Bucket): string {
  if (bucket === 'recycle') return 'Recycled';
  if (bucket === 'ewaste') return 'E-waste — rejected';
  return 'Sent to landfill';
}

/** Capitalize the item name for display. */
export function itemTitle(item: string): string {
  return item ? item.charAt(0).toUpperCase() + item.slice(1) : 'Item';
}
