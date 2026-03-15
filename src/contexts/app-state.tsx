"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export interface ContextType {
  searchPlaceholder: string;
  setSearchPlaceholder: React.Dispatch<React.SetStateAction<string>>;
}

export const Context = createContext<ContextType>({
  searchPlaceholder: "Search accounts",
  setSearchPlaceholder: () => {},
});

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("Search accounts");

  return (
    <Context.Provider value={{ searchPlaceholder, setSearchPlaceholder }}>
      {children}
    </Context.Provider>
  );
};

export default function useAppState() {
  return useContext(Context);
}
