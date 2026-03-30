export interface SidebarItem {
  type?: "collection" | "team" | "tag";
  slug: string;
  icon: string;
  id: string;
  label: string;
  description?: string;
  color?: string;
}

export interface Platform {
  name: string;
  domain: string;
  count: number;
}

export interface AccountCustomField {
  id: string;
  type: string;
  label: string;
  value: string;
  pinned?: boolean;
}

export interface AccountTag {
  id: string;
  name: string;
  color?: string;
}

export interface SharedUser {
  id: string;
  name: string;
  email?: string;
  image?: string;
  permission?: "view" | "edit" | "owner";
}

export interface SharedTeam {
  id: string;
  name: string;
  memberCount?: number;
  permission?: "view" | "edit";
}

export interface Account {
  id: string;
  title?: string;
  email?: string;
  username?: string;
  hasPassword?: boolean;
  label?: string;
  notes?: string;
  isFavorite?: boolean;
  tags?: AccountTag[];
  customFields?: AccountCustomField[];
  owner?: SharedUser;
  sharedWith?: SharedUser[];
  sharedWithTeams?: SharedTeam[];
  createdAt?: Date;
  updatedAt?: Date;
}
