import { atom } from "jotai";

export const atomWithLocalStorage = <T = unknown>(key: string) => {
  const getStoredValue = () => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(key);
  };

  const baseAtom = atom(getStoredValue());

  return atom(
    (get) => {
      const value = get(baseAtom);

      return value ? (JSON.parse(value) as T) : null;
    },
    (get, set, arg: T) => {
      const serialized = JSON.stringify(arg);
      set(baseAtom, serialized);
      localStorage.setItem(key, serialized);
    }
  );
};
