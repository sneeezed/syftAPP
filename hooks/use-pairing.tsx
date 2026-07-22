import { createContext, useContext, useState, type ReactNode } from 'react';

type PairingContextValue = {
  paired: boolean;
  setPaired: (value: boolean) => void;
};

const PairingContext = createContext<PairingContextValue | undefined>(undefined);

/**
 * Holds whether the user has paired a Syft trashcan. App-wide so Home, Settings
 * and the menu all read the same value. For the demo it's a plain toggle (there's
 * no real device yet) — flip it from Settings to preview the not-yet-paired flow.
 */
export function PairingProvider({ children }: { children: ReactNode }) {
  // Start paired so the app opens on the normal dashboard.
  const [paired, setPaired] = useState(true);

  return (
    <PairingContext.Provider value={{ paired, setPaired }}>
      {children}
    </PairingContext.Provider>
  );
}

export function usePairing() {
  const ctx = useContext(PairingContext);
  if (!ctx) {
    throw new Error('usePairing must be used within a PairingProvider');
  }
  return ctx;
}
