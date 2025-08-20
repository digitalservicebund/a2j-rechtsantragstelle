import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { pkhFormularFinanzielleAngabenKinderPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/kinder/pages";

export const pkhFormularFinanzielleAngabenPages = {
  ...pkhFormularFinanzielleAngabenEinkuenftePages,
  ...pkhFormularFinanzielleAngabenPartnerPages,
  ...pkhFormularFinanzielleAngabenKinderPages,
} as const satisfies PagesConfig;
