/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return <div className="h-10 w-30" />;
  }

  return (
    <ToggleButtonGroup
      selectionMode="single"
      selectedKeys={new Set([theme || "system"])}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        if (selected) {
          setTheme(selected);
        }
      }}
      className="rounded-full border-0 bg-[#1D1C21] p-1"
      size="md"
    >
      <ToggleButton
        id="light"
        variant="ghost"
        className="rounded-full border-0 text-[#6A6A6F] hover:text-[#9A9A9F] data-[selected=true]:bg-[#28282D] data-[selected=true]:text-[#EAEAEC]"
        aria-label="Light theme"
      >
        <Sun size={18} />
      </ToggleButton>
      <ToggleButton
        id="dark"
        variant="ghost"
        className="rounded-full border-0 text-[#6A6A6F] hover:text-[#9A9A9F] data-[selected=true]:bg-[#28282D] data-[selected=true]:text-[#EAEAEC]"
        aria-label="Dark theme"
      >
        <Moon size={18} />
      </ToggleButton>
      <ToggleButton
        id="system"
        variant="ghost"
        className="rounded-full border-0 text-[#6A6A6F] hover:text-[#9A9A9F] data-[selected=true]:bg-[#28282D] data-[selected=true]:text-[#EAEAEC]"
        aria-label="System theme"
      >
        <Monitor size={18} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
