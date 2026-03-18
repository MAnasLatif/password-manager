"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

export interface ContextType {
  searchPlaceholder: string;
  setSearchPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  addButton: {
    tooltip: string;
    on: string;
  };
  setAddButton: React.Dispatch<React.SetStateAction<{ tooltip: string; on: string }>>;
}

export const Context = createContext<ContextType>({
  searchPlaceholder: "Search accounts",
  setSearchPlaceholder: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  addButton: {
    tooltip: "Add new",
    on: "/new",
  },
  setAddButton: () => {},
});

export const AppStateProvider = ({ children }: PropsWithChildren) => {
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("Search accounts");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addButton, setAddButton] = useState<{ tooltip: string; on: string }>({
    tooltip: "Add new",
    on: "/new",
  });
  return (
    <Context.Provider
      value={{
        searchPlaceholder,
        setSearchPlaceholder,
        searchQuery,
        setSearchQuery,
        addButton,
        setAddButton,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default function useAppState() {
  return useContext(Context);
}
