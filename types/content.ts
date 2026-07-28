export type ContentStatus =
  "approved" | "placeholder" | "unavailable" | "vacant";

export type LeadershipRole = {
  additionalRole?: string;
  biography?: string;
  image?: string;
  name?: string;
  publicContactUrl?: string;
  responsibilities?: string;
  role: string;
  status: ContentStatus;
  term?: string;
};

export type EventStatus = "upcoming" | "completed" | "sold-out" | "cancelled";

export type Event = {
  allDay?: boolean;
  date: string;
  description: string;
  detailsUrl?: string;
  endDate?: string;
  featured?: boolean;
  graphicAlt?: string;
  graphicUrl?: string;
  id?: string;
  location?: string;
  registrationUrl?: string;
  slug: string;
  status: EventStatus;
  title: string;
};

export type NewsCategory =
  | "Announcement"
  | "Community"
  | "Event"
  | "Federation"
  | "Leadership"
  | "Statement";

export type NewsArticle = {
  body: string[];
  category: NewsCategory;
  date: string;
  excerpt: string;
  featuredImage?: string;
  slug: string;
  title: string;
};

export type SponsorTier = "Patron" | "Sustaining" | "Supporting";

export type Sponsor = {
  name: string;
  tier: SponsorTier;
};

export type SocialLink = {
  href: string;
  label: "Facebook" | "Instagram" | "TikTok" | "X";
};
