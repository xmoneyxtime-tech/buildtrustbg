export type CanonicalSlugPreference = {
  // Normalized key (from BG/EN label) used to match duplicate groups.
  normalizedKey: string;
  locale: "bg" | "en" | "either";
  preferredCanonicalSlug: string;
  priority?: number;
  note?: string;
};

// Environment-independent canonical preferences.
// These rules never reference database IDs.
export const CANONICAL_SLUG_PREFERENCES: CanonicalSlugPreference[] = [
  {
    normalizedKey: "оградни системи",
    locale: "bg",
    preferredCanonicalSlug: "ogradni-sistemi",
    priority: 100,
    note: "Manual conflict resolution from DS-001.2B.",
  },
  {
    normalizedKey: "fencing",
    locale: "en",
    preferredCanonicalSlug: "ogradni-sistemi",
    priority: 100,
    note: "Keep BG canonical label aligned with approved decision.",
  },
];

export const CANONICAL_ARCHIVE_STRATEGY = "set-inactive" as const;
