export const AUTH_SESSION_COOKIE = "auth_session";
export const DEMO_PASSWORD = "1omneDemo#2026";

export type DemoProfile = {
  username: string;
  displayName: string;
  linkedInUrl: string;
  roleLabel: string;
  companyLabel: string;
  locationLabel: string;
  educationLabel: string;
  connectionsLabel: string;
};

export const DEMO_PROFILES: DemoProfile[] = [
  {
    username: "gregp",
    displayName: "Greg P.",
    linkedInUrl: "https://www.linkedin.com/in/greg-pearre/",
    roleLabel: "VP of Product",
    companyLabel: "Omnesoft",
    locationLabel: "Westminster, Maryland, United States",
    educationLabel: "Villa Julie College",
    connectionsLabel: "500+ connections",
  },
  {
    username: "socialscientists",
    displayName: "Social Scientists",
    linkedInUrl: "https://www.linkedin.com/in/socialscientists/",
    roleLabel: "Research and audience profile",
    companyLabel: "Mapped from LinkedIn reference",
    locationLabel: "Profile details pending",
    educationLabel: "Education not yet mapped",
    connectionsLabel: "Connections not yet mapped",
  },
  {
    username: "noamalper",
    displayName: "Noam Alper",
    linkedInUrl: "https://www.linkedin.com/in/noam-alper-52785311/",
    roleLabel: "Chief Technology Officer",
    companyLabel: "Omnesoft",
    locationLabel: "Pikesville, Maryland, United States",
    educationLabel: "Yeshiva University",
    connectionsLabel: "500+ connections",
  },
];

export const DEFAULT_DEMO_USERNAME = DEMO_PROFILES[0]?.username ?? "gregp";

export function getDemoProfileByUsername(username: string) {
  return DEMO_PROFILES.find(
    (profile) =>
      profile.username.toLowerCase() === username.trim().toLowerCase(),
  );
}

export function isDemoSession(value: string | undefined) {
  return Boolean(value && getDemoProfileByUsername(value));
}

export function isValidDemoCredentials(username: string, password: string) {
  return (
    Boolean(getDemoProfileByUsername(username)) && password === DEMO_PASSWORD
  );
}
