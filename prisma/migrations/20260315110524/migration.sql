-- CreateEnum
CREATE TYPE "VaultEntryVisibility" AS ENUM ('PRIVATE', 'GROUP', 'SHARED');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'EMAIL', 'URL', 'SECRET', 'IMAGE', 'KEY_VALUE');

-- CreateEnum
CREATE TYPE "SharePermission" AS ENUM ('VIEW_METADATA', 'REVEAL_PASSWORD', 'COPY_PASSWORD');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('ACCOUNT_CREATED', 'ACCOUNT_UPDATED', 'ACCOUNT_ARCHIVED', 'ACCOUNT_DELETED', 'PASSWORD_VIEWED', 'PASSWORD_COPIED', 'PASSWORD_CHANGED', 'ACCOUNT_SHARED', 'SHARE_REVOKED', 'ACCOUNT_MOVED', 'GROUP_CREATED', 'GROUP_UPDATED', 'GROUP_DELETED', 'TEAM_CREATED', 'TEAM_UPDATED', 'TEAM_DELETED', 'MEMBER_ADDED', 'MEMBER_REMOVED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "idToken" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL DEFAULT false,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aaguid" TEXT,

    CONSTRAINT "passkey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pinHash" TEXT,
    "vaultTimeoutMinutes" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_presets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "suggestedUrl" TEXT,

    CONSTRAINT "platform_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platformPresetId" TEXT,
    "url" TEXT,
    "usernameOrEmail" TEXT,
    "encryptedPassword" TEXT NOT NULL,
    "notes" TEXT,
    "iconKey" TEXT,
    "visibility" "VaultEntryVisibility" NOT NULL DEFAULT 'PRIVATE',
    "groupId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_entry_custom_fields" (
    "id" TEXT NOT NULL,
    "vaultEntryId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "fieldType" "CustomFieldType" NOT NULL DEFAULT 'TEXT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_entry_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vaultEntryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_entry_shares" (
    "id" TEXT NOT NULL,
    "vaultEntryId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "sharedWithId" TEXT NOT NULL,
    "permissions" "SharePermission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "vault_entry_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_entry_team_shares" (
    "id" TEXT NOT NULL,
    "vaultEntryId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "permissions" "SharePermission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "vault_entry_team_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_history" (
    "id" TEXT NOT NULL,
    "vaultEntryId" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changedById" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "targetEntityId" TEXT,
    "vaultEntryId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "passkey_userId_idx" ON "passkey"("userId");

-- CreateIndex
CREATE INDEX "passkey_credentialID_idx" ON "passkey"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "vault_settings_userId_key" ON "vault_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_presets_name_key" ON "platform_presets"("name");

-- CreateIndex
CREATE INDEX "vault_entries_userId_idx" ON "vault_entries"("userId");

-- CreateIndex
CREATE INDEX "vault_entries_groupId_idx" ON "vault_entries"("groupId");

-- CreateIndex
CREATE INDEX "vault_entries_platformPresetId_idx" ON "vault_entries"("platformPresetId");

-- CreateIndex
CREATE INDEX "vault_entries_title_idx" ON "vault_entries"("title");

-- CreateIndex
CREATE INDEX "vault_entries_archived_idx" ON "vault_entries"("archived");

-- CreateIndex
CREATE INDEX "vault_entry_custom_fields_vaultEntryId_idx" ON "vault_entry_custom_fields"("vaultEntryId");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_vaultEntryId_name_key" ON "tags"("vaultEntryId", "name");

-- CreateIndex
CREATE INDEX "groups_userId_idx" ON "groups"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON "group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_teamId_userId_key" ON "team_members"("teamId", "userId");

-- CreateIndex
CREATE INDEX "vault_entry_shares_sharedById_idx" ON "vault_entry_shares"("sharedById");

-- CreateIndex
CREATE INDEX "vault_entry_shares_sharedWithId_idx" ON "vault_entry_shares"("sharedWithId");

-- CreateIndex
CREATE UNIQUE INDEX "vault_entry_shares_vaultEntryId_sharedWithId_key" ON "vault_entry_shares"("vaultEntryId", "sharedWithId");

-- CreateIndex
CREATE UNIQUE INDEX "vault_entry_team_shares_vaultEntryId_teamId_key" ON "vault_entry_team_shares"("vaultEntryId", "teamId");

-- CreateIndex
CREATE INDEX "password_history_vaultEntryId_idx" ON "password_history"("vaultEntryId");

-- CreateIndex
CREATE INDEX "password_history_changedAt_idx" ON "password_history"("changedAt");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_vaultEntryId_idx" ON "activity_logs"("vaultEntryId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_settings" ADD CONSTRAINT "vault_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entries" ADD CONSTRAINT "vault_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entries" ADD CONSTRAINT "vault_entries_platformPresetId_fkey" FOREIGN KEY ("platformPresetId") REFERENCES "platform_presets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entries" ADD CONSTRAINT "vault_entries_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_custom_fields" ADD CONSTRAINT "vault_entry_custom_fields_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_shares" ADD CONSTRAINT "vault_entry_shares_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_shares" ADD CONSTRAINT "vault_entry_shares_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_shares" ADD CONSTRAINT "vault_entry_shares_sharedWithId_fkey" FOREIGN KEY ("sharedWithId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_team_shares" ADD CONSTRAINT "vault_entry_team_shares_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_entry_team_shares" ADD CONSTRAINT "vault_entry_team_shares_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_history" ADD CONSTRAINT "password_history_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_history" ADD CONSTRAINT "password_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_vaultEntryId_fkey" FOREIGN KEY ("vaultEntryId") REFERENCES "vault_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
