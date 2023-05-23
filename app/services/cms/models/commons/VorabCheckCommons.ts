import type { Localizable } from "../Localizable";

export interface VorabCheckCommons extends Localizable {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  progressBarLabel: string;
  resultHintLabel: string;
  backButtonDefaultLabel: string;
  nextButtonDefaultLabel: string;
  lastNextButtonLabel: string;
}
