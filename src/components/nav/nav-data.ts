export type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  kind?: "link" | "action";
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export const navigationSections: NavigationSection[] = [
  {
    title: "General",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "dashboard",
      },
      { name: "Tracking", href: "/tracking", icon: "tracking" },
      { name: "Audience", href: "#", icon: "audience" },
      { name: "Calendar", href: "#", icon: "calendar" },
      {
        name: "Analytics & Reports",
        href: "#",
        icon: "analytics",
      },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Help", href: "#", icon: "help" },
      { name: "Settings", href: "#", icon: "settings" },
      {
        name: "Log out",
        href: "/api/auth/logout",
        icon: "logout",
        kind: "action",
      },
    ],
  },
];
