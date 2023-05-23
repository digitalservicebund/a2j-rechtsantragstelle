import type { Localizable } from "../Localizable";
import type { Timestampable } from "../Timestampable";

export interface VorabCheckCommons extends Localizable, Timestampable {
  progressBarLabel: string;
  resultHintLabel: string;
  backButtonDefaultLabel: string;
  nextButtonDefaultLabel: string;
  lastNextButtonLabel: string;
}
