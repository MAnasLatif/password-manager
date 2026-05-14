"use client";

import { Avatar, Button, cn, Dropdown, Label, SearchField, Tooltip } from "@heroui/react";
import { LogOut, Plus, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { ThemeToggle } from "@/components/ThemeSwitcher";
import useAppState from "@/contexts/app-state";
import { signOut, useSession } from "@/lib/auth-client";

export function AppHeader({ className }: { className?: string }) {
  const { searchPlaceholder, searchQuery, setSearchQuery, addButton } = useAppState();
  const router = useRouter();
  const { data: session } = useSession();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedValue] = useDebounceValue(inputValue, 300);

  useEffect(() => {
    if (debouncedValue) {
      setSearchQuery(debouncedValue);
    } else {
      setSearchQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, setSearchQuery]);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className={cn("flex items-center justify-between gap-4 p-4", className)}>
      {/* Logo + Brand */}
      <Link href="/" className="flex w-full max-w-50 items-center gap-2.5">
        <Image src="/logo.svg" alt="MAAnasVault logo" width={28} height={28} className="size-7" />
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-sm">MAnasPM</span>
          <span className="text-[10px] text-muted">Password Manager</span>
        </div>
      </Link>

      {/* Search */}
      <div className="m-auto flex w-full max-w-2xl flex-1 items-center gap-4">
        <SearchField
          variant="secondary"
          value={inputValue}
          onChange={setInputValue}
          onClear={() => setInputValue("")}
          className="w-full"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={`${searchPlaceholder}...`} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        {/* Add new */}
        <Tooltip delay={0}>
          <Link href={addButton.on}>
            <Button isIconOnly variant="secondary" aria-label={addButton.tooltip}>
              <Plus className="size-4" />
            </Button>
          </Link>
          <Tooltip.Content>
            <p>{addButton.tooltip}</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-25 shrink-0 items-center justify-end gap-2">
        {/* Theme toggle – re-use existing */}
        <ThemeToggle variant="ghost" size="sm" className="text-muted" />

        {/* User avatar dropdown */}
        <Dropdown>
          <Dropdown.Trigger className="rounded-full">
            <Avatar>
              <Avatar.Image src={session?.user?.image ?? ""} alt={session?.user?.name ?? "User"} />
              <Avatar.Fallback delayMs={0}>{userInitials}</Avatar.Fallback>
            </Avatar>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image
                    src={session?.user?.image ?? ""}
                    alt={session?.user?.name ?? "User"}
                  />
                  <Avatar.Fallback delayMs={0}>{userInitials}</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col gap-0">
                  <p className="font-medium text-sm leading-5">{session?.user?.name ?? "Guest"}</p>
                  <p className="text-muted text-xs leading-none">{session?.user?.email ?? ""}</p>
                </div>
              </div>
            </div>
            <Dropdown.Menu
              onAction={async (key) => {
                if (key === "profile") router.push("/profile");
                if (key === "settings") router.push("/settings");
                if (key === "logout") {
                  await signOut();
                  router.push("/login");
                }
              }}
            >
              <Dropdown.Item id="profile" textValue="Profile">
                <User className="size-3.5 text-muted" />
                <Label>Profile</Label>
              </Dropdown.Item>
              <Dropdown.Item id="settings" textValue="Settings">
                <Settings className="size-3.5 text-muted" />
                <Label>Settings</Label>
              </Dropdown.Item>
              <Dropdown.Item id="logout" textValue="Log out" variant="danger">
                <LogOut className="size-3.5 text-danger" />
                <Label>Log Out</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
