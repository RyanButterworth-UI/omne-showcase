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
    ],
  },
  {
    title: "Support",
    items: [
      {
        name: "Log out",
        href: "/api/auth/logout",
        icon: "logout",
        kind: "action",
      },
    ],
  },
];
