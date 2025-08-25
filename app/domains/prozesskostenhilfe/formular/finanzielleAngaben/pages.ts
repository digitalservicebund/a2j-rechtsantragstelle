import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/andere-unterhaltszahlungen/pages";
import { pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";
import { pkhFormularFinanzielleAngabenEigentumPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/eigentum/pages";
import { pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { pkhFormularFinanzielleAngabenKinderPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/kinder/pages";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { pkhFormularFinanzielleAngabenWohnungPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/wohnung/pages";

export const pkhFormularFinanzielleAngabenPages = {
  ...pkhFormularFinanzielleAngabenEinkuenftePages,
  ...pkhFormularFinanzielleAngabenPartnerPages,
  ...pkhFormularFinanzielleAngabenKinderPages,
  ...pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages,
  ...pkhFormularFinanzielleAngabenWohnungPages,
  ...pkhFormularFinanzielleAngabenEigentumPages,
  ...pkhFormularFinanzielleAngabenAusgabenPages,
} as const satisfies PagesConfig;
