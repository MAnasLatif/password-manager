export interface SidebarItem {
  type?: "group" | "team";
  slug: string;
  icon: string;
  id: string;
  label: string;
  description?: string;
}
