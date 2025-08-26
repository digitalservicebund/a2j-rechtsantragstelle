import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./andereUnterhaltszahlungen/pages";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";
import { berhAntragFinanzielleAngabenKinderPages } from "./kinder/pages";
import { berhAntragFinanzielleAngabenPartnerPages } from "./partner/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
  ...berhAntragFinanzielleAngabenPartnerPages,
  ...berhAntragFinanzielleAngabenKinderPages,
  ...berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages,
} as const satisfies PagesConfig;
