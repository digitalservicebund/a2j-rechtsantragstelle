import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";
import { berhAntragFinanzielleAngabenKinderPages } from "./kinder/pages";
import { berhAntragFinanzielleAngabenPartnerPages } from "./partner/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
  ...berhAntragFinanzielleAngabenPartnerPages,
  ...berhAntragFinanzielleAngabenKinderPages,
} as const satisfies PagesConfig;
