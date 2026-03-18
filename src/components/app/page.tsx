"use client";

import useAppState from "@/contexts/app-state";
import type { Platform } from "@/types";
import { getFaviconUrl, getInitials, stringToColor } from "@/utils";
import { Avatar } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage({
  platforms,
}: Readonly<{
  platforms: Platform[];
}>) {
  const { setSearchPlaceholder } = useAppState();

  useEffect(() => {
    setSearchPlaceholder("Search platforms");
  }, [setSearchPlaceholder]);

  return (
    <div className="flex flex-col gap-1">
      {platforms.map((platform, index) => (
        <Link
          key={index}
          href={`/p/${platform.domain}`}
          className="hover:bg-surface active:bg-surface-pressed flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors"
        >
          {/* Avatar */}
          <Avatar size="sm" className="shrink-0">
            <Avatar.Image src={getFaviconUrl(platform.domain)} alt={platform.name} />
            <Avatar.Fallback
              style={{
                backgroundColor: stringToColor(platform.name),
                color: "white",
              }}
              className="text-sm font-semibold"
            >
              {getInitials(platform.name)}
            </Avatar.Fallback>
          </Avatar>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-semibold">{platform.name}</span>
            <span className="text-muted text-xs">{platform.domain}</span>
          </div>

          {/* Count */}
          <span className="text-muted text-sm font-medium">{platform.count}</span>

          {/* Chevron */}
          <ChevronRight className="text-muted size-4 shrink-0" />
        </Link>
      ))}
    </div>
  );
}
