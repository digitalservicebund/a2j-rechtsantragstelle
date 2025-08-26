import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./andereUnterhaltszahlungen/pages";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";
import { berhAntragFinanzielleAngabenPartnerPages } from "./partner/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
  ...berhAntragFinanzielleAngabenPartnerPages,
  ...berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages,
} as const satisfies PagesConfig;
