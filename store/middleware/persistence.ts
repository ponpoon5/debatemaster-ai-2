/**
 * LocalStorage Persistence Middleware
 * Zustand用のLocalStorage永続化ミドルウェア（デバウンス付き）
 */

import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type PersistenceOptions = {
  storageKey: string;
  debounceMs?: number;
};

type Write<T, U> = Omit<T, keyof U> & U;
type Cast<T, U> = T extends U ? T : U;

export type Persistence = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options: PersistenceOptions
) => StateCreator<T, Mps, Mcs>;

type PersistenceImpl = <T>(
  config: StateCreator<T, [], []>,
  options: PersistenceOptions
) => StateCreator<T, [], []>;

const persistenceImpl: PersistenceImpl = (config, options) => (set, get, api) => {
  const { storageKey, debounceMs = 1000 } = options;
  let timeoutId: NodeJS.Timeout | null = null;

  // Load initial state from localStorage
  const loadFromStorage = (): Partial<T> | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved) as Partial<T>;
      }
    } catch (error) {
      console.error(`❌ Failed to load from localStorage (${storageKey}):`, error);
    }
    return null;
  };

  // Save state to localStorage with debounce
  const saveToStorage = (state: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error(`❌ Failed to save to localStorage (${storageKey}):`, error);
      }
    }, debounceMs);
  };

  // Initialize state from localStorage
  const initialState = loadFromStorage();
  const stateCreator = config(
    (args) => {
      set(args);
      saveToStorage(get());
    },
    get,
    api
  );

  // Merge initial state from localStorage
  if (initialState) {
    Object.assign(stateCreator, initialState);
  }

  // Subscribe to state changes
  api.subscribe((state) => {
    saveToStorage(state);
  });

  return stateCreator;
};

export const persistence = persistenceImpl as unknown as Persistence;
