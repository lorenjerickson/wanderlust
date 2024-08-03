import { atom } from "jotai";

export const atomWithLocalStorage = <T = any>(key: string) => {
  const baseAtom = atom(localStorage.getItem(key));

  return atom(
    (get) => JSON.parse(get(baseAtom) || ""),
    (get, set, arg: T) => {
      const serialized = JSON.stringify(arg);
      set(baseAtom, serialized);
      localStorage.setItem(key, serialized);
    }
  );
};
