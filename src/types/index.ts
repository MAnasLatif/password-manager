export interface SidebarItem {
  type?: "collection" | "team";
  slug: string;
  icon: string;
  id: string;
  label: string;
  description?: string;
}

export interface Platform {
  name: string;
  domain: string;
  count: number;
}

export interface Account {
  id: string;
  title?: string;
  email?: string;
  username?: string;
  hasPassword?: boolean;
  label?: string;
  notes?: string;
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
