"use client";

import { Avatar } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import useAppState from "@/contexts/app-state";
import type { Platform } from "@/types";
import { getFaviconUrl, getInitials, stringToColor } from "@/utils";

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
          className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-surface active:bg-surface-pressed"
        >
          {/* Avatar */}
          <Avatar size="sm" className="shrink-0">
            <Avatar.Image src={getFaviconUrl(platform.domain)} alt={platform.name} />
            <Avatar.Fallback
              style={{
                backgroundColor: stringToColor(platform.name),
                color: "white",
              }}
              className="font-semibold text-sm"
            >
              {getInitials(platform.name)}
            </Avatar.Fallback>
          </Avatar>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <span className="font-semibold text-sm">{platform.name}</span>
            <span className="text-muted text-xs">{platform.domain}</span>
          </div>

          {/* Count */}
          <span className="font-medium text-muted text-sm">{platform.count}</span>

          {/* Chevron */}
          <ChevronRight className="size-4 shrink-0 text-muted" />
        </Link>
      ))}
    </div>
  );
}
