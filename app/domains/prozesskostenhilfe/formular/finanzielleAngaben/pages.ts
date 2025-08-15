import { type PagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { finanzielleAngabenPartnerPages } from "~/domains/shared/formular/finanzielleAngaben/partner/pages";

export const pkhFormularFinanzielleAngabenPages = {
  ...pkhFormularFinanzielleAngabenEinkuenftePages,
  ...finanzielleAngabenPartnerPages,
} as const satisfies PagesConfig;
