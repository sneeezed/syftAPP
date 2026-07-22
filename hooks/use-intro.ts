import { useEffect, useState } from 'react';

// Tracks whether the initial cold launch intro animation window has completed.
// Module-scoped variable persists across screen navigation within the app session.
let hasCompletedIntro = false;

/**
 * Gate screen entrance animations so they play ONCE when the app is opened on initial cold launch,
 * and NEVER again during navigation (e.g. opening/closing hamburger menu, settings, profile, history, etc.).
 *
 * @param _key   Optional screen key for clarity.
 * @param holdMs How long to keep `entering` live on initial app launch.
 */
export function useIntro(_key?: string, holdMs = 1400) {
  const [intro, setIntro] = useState(() => !hasCompletedIntro);

  useEffect(() => {
    if (hasCompletedIntro) {
      setIntro(false);
      return;
    }

    const timer = setTimeout(() => {
      hasCompletedIntro = true;
      setIntro(false);
    }, holdMs);

    return () => {
      clearTimeout(timer);
    };
  }, [holdMs]);

  return intro;
}
