import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { pkhFormularFinanzielleAngabenKinderPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/kinder/pages";
import { pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/andere-unterhaltszahlungen/pages";

export const pkhFormularFinanzielleAngabenPages = {
  ...pkhFormularFinanzielleAngabenEinkuenftePages,
  ...pkhFormularFinanzielleAngabenPartnerPages,
  ...pkhFormularFinanzielleAngabenKinderPages,
  ...pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages,
} as const satisfies PagesConfig;
