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

export interface Account {
  id: string;
  title?: string;
  email?: string;
  username?: string;
  hasPassword?: boolean;
  label?: string;
  notes?: string;
  customFields?: AccountCustomField[];
  sharedWith?: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    permission?: "view" | "edit" | "owner";
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
