import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";
import { berhAntragFinanzielleAngabenKinderPages } from "./kinder/pages";
import { berhAntragFinanzielleAngabenPartnerPages } from "./partner/pages";
import { berhAntragFinanzielleAngabenWohnungPages } from "./wohnung/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
  ...berhAntragFinanzielleAngabenPartnerPages,
  ...berhAntragFinanzielleAngabenKinderPages,
  ...berhAntragFinanzielleAngabenWohnungPages,
} as const satisfies PagesConfig;
