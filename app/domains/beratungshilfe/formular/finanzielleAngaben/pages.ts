import { type PagesConfig } from "~/domains/pageSchemas";
import { berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./andereUnterhaltszahlungen/pages";
import { berhAntragFinanzielleAngabenEigentumPages } from "./eigentum/pages";
import { berhAntragFinanzielleAngabenEinkommenPages } from "./einkommen/pages";
import { berhAntragFinanzielleAngabenKinderPages } from "./kinder/pages";
import { berhAntragFinanzielleAngabenPartnerPages } from "./partner/pages";
import { berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./regelmaessigeAusgaben/pages";
import { berhAntragFinanzielleAngabenWohnungPages } from "./wohnung/pages";

export const berhAntragFinanzielleAngabenPages = {
  ...berhAntragFinanzielleAngabenEinkommenPages,
  ...berhAntragFinanzielleAngabenPartnerPages,
  ...berhAntragFinanzielleAngabenKinderPages,
  ...berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages,
  ...berhAntragFinanzielleAngabenWohnungPages,
  ...berhAntragFinanzielleAngabenEigentumPages,
  ...berhAntragFinanzielleAngabenRegelmassigeAusgabenPages,
} as const satisfies PagesConfig;
