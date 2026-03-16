export interface SidebarItem {
  type?: "collection" | "team";
  slug: string;
  icon: string;
  id: string;
  label: string;
  description?: string;
}
