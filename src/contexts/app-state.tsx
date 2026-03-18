"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export interface ContextType {
  searchPlaceholder: string;
  setSearchPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const Context = createContext<ContextType>({
  searchPlaceholder: "Search accounts",
  setSearchPlaceholder: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
});

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("Search accounts");
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <Context.Provider
      value={{ searchPlaceholder, setSearchPlaceholder, searchQuery, setSearchQuery }}
    >
      {children}
    </Context.Provider>
  );
};

export default function useAppState() {
  return useContext(Context);
}
