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
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
