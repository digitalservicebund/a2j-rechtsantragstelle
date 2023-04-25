import type { Locale } from "~/services/cms/models/Locale";

export type VorabCheckCommons = {
  locale: Locale;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  progressBarLabel: string;
};
