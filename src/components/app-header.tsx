"use client";

import useAppState from "@/contexts/app-state";
import { useQueryParams } from "@/hooks/use-query-params";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, Button, Dropdown, Label, SearchField } from "@heroui/react";
import { ThemeToggle } from "@/components/ThemeSwitcher";
import { LogOut, Plus, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export function AppHeader() {
  const { searchPlaceholder } = useAppState();
  const { get, set, remove } = useQueryParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [inputValue, setInputValue] = useState(get("search") ?? "");
  const [debouncedValue] = useDebounceValue(inputValue, 300);

  useEffect(() => {
    if (debouncedValue) {
      set("search", debouncedValue);
    } else {
      remove("search");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="flex h-14 items-center justify-between gap-4 px-8">
      {/* Logo + Brand */}
      <Link href="/" className="flex shrink-0 items-center gap-2.5">
        <Image src="/logo.svg" alt="MAAnasVault logo" width={28} height={28} className="size-7" />
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold">MAnasPM</span>
          <span className="text-muted text-[10px]">Password Manager</span>
        </div>
      </Link>

      {/* Search */}
      <div className="flex max-w-lg flex-1 items-center gap-4">
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
        <Link href="/new">
          <Button isIconOnly variant="secondary" aria-label="Add new">
            <Plus className="size-4" />
          </Button>
        </Link>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Theme toggle – re-use existing */}
        <ThemeToggle variant="ghost" size="sm" className="text-muted" />

        {/* User avatar dropdown */}
        <Dropdown>
          <Dropdown.Trigger className="rounded-full">
            <Avatar>
              {session?.user?.image && (
                <Avatar.Image src={session.user.image} alt={session.user.name ?? "User"} />
              )}
              <Avatar.Fallback delayMs={0}>{userInitials}</Avatar.Fallback>
            </Avatar>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            {session?.user && (
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    {session.user.image && (
                      <Avatar.Image src={session.user.image} alt={session.user.name ?? "User"} />
                    )}
                    <Avatar.Fallback delayMs={0}>{userInitials}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col gap-0">
                    <p className="text-sm leading-5 font-medium">{session.user.name}</p>
                    <p className="text-muted text-xs leading-none">{session.user.email}</p>
                  </div>
                </div>
              </div>
            )}
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
                <User className="text-muted size-3.5" />
                <Label>Profile</Label>
              </Dropdown.Item>
              <Dropdown.Item id="settings" textValue="Settings">
                <Settings className="text-muted size-3.5" />
                <Label>Settings</Label>
              </Dropdown.Item>
              <Dropdown.Item id="logout" textValue="Log out" variant="danger">
                <LogOut className="text-danger size-3.5" />
                <Label>Log Out</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
