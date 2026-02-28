export interface Company {
  id: string;
  name: string;
  domain: string;
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B";
  sector: string;
  location: string;
  founded: number;
  employees: string;
  raised: string;
  score: number;
  tags: string[];
  lastSignal: string;
  description: string;
}

export interface Signal {
  date: string;
  type: "funding" | "hiring" | "product" | "press" | "partnership";
  text: string;
}

export interface EnrichResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: { url: string; note: string }[];
  fetchedAt: string;
}

export interface SavedList {
  id: string;
  name: string;
  companies: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: { sector: string; stage: string; query: string };
  createdAt: string;
  runCount: number;
  lastRun?: string;
}
