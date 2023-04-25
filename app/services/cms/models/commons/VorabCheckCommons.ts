import type { Locale } from "~/services/cms/models/Locale";

export type VorabCheckCommons = {
  locale: Locale;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  progressBarLabel: string;
  resultHintLabel: string;
  backButtonDefaultLabel: string;
  nextButtonDefaultLabel: string;
  lastNextButtonLabel: string;
};
