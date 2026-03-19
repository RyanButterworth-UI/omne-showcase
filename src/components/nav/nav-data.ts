export type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
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
        current: true,
      },
      { name: "Tracking", href: "#", icon: "tracking", current: false },
      { name: "Audience", href: "#", icon: "audience", current: false },
      { name: "Calendar", href: "#", icon: "calendar", current: false },
      {
        name: "Analytics & Reports",
        href: "#",
        icon: "analytics",
        current: false,
      },
    ],
  },
  {
    title: "Support",
    items: [
      { name: "Help", href: "#", icon: "help", current: false },
      { name: "Settings", href: "#", icon: "settings", current: false },
      { name: "Log out", href: "#", icon: "logout", current: false },
    ],
  },
];
