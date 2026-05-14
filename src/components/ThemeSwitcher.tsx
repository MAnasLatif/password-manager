"use client";

import type { ButtonProps } from "@heroui/react";
import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle(ToggleProps: ButtonProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      isIconOnly
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
      {...ToggleProps}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
