"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface CatBackgroundContextValue {
  visible: boolean;
  toggle: () => void;
}

const CatBackgroundContext = createContext<CatBackgroundContextValue>({
  visible: true,
  toggle: () => {},
});

const STORAGE_KEY = "samy-cat-background-visible";

export function CatBackgroundProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setVisible(stored !== "false");
    }
  }, []);

  const toggle = () => {
    setVisible((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <CatBackgroundContext.Provider value={{ visible, toggle }}>
      {children}
    </CatBackgroundContext.Provider>
  );
}

export function useCatBackground() {
  return useContext(CatBackgroundContext);
}
