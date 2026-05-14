"use client";

import { Avatar, Button, Tooltip } from "@heroui/react";
import { ArrowLeft, ExternalLink, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import useAppState from "@/contexts/app-state";
import type { Account, Platform } from "@/types";
import { getFaviconUrl, getInitials, stringToColor } from "@/utils";
import AccountCard from "./account-card";

interface PlatformDetailPageProps {
  platform: Platform;
  accounts: Account[];
}

export default function PlatformDetailPage({ platform, accounts }: PlatformDetailPageProps) {
  const { setSearchPlaceholder, setAddButton } = useAppState();

  useEffect(() => {
    const tooltip = `Add new ${platform.name} account`;
    const on = `/new?platform=${platform.domain}`;

    setSearchPlaceholder(`Search ${platform.name} accounts`);
    setAddButton((current) => {
      if (current.tooltip === tooltip && current.on === on) {
        return current;
      }

      return { tooltip, on };
    });
  }, [platform.name, platform.domain, setSearchPlaceholder, setAddButton]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button and platform info */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button isIconOnly variant="ghost" size="sm" aria-label="Go back">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar size="md">
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
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{platform.name}</span>
            <span className="text-muted text-sm">{platform.domain}</span>
          </div>
        </div>
        <Tooltip delay={0}>
          <Link href={platform.domain} target="_blank" rel="noopener noreferrer">
            <Button isIconOnly variant="ghost" size="sm" aria-label="Open website">
              <ExternalLink className="size-4 text-muted" />
            </Button>
          </Link>
          <Tooltip.Content>
            <p>Open {platform.domain}</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Accounts list */}
      <div className="flex flex-col gap-3">
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted">
            <LockKeyhole className="mb-3 size-12 opacity-40" />
            <p className="text-sm">No accounts yet</p>
            <p className="text-xs opacity-70">Add your first {platform.name} account</p>
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} platform={platform} />
          ))
        )}
      </div>
    </div>
  );
}
