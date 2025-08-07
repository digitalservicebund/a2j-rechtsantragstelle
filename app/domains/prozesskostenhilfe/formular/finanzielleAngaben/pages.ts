import { type PagesConfig } from "~/domains/pageSchemas";
import { finanzielleAngabenPartnerPages } from "~/domains/shared/formular/finanzielleAngaben/partner/pages";

export const pkhFormularFinanzielleAngabenPages = {
  ...finanzielleAngabenPartnerPages,
} as const satisfies PagesConfig;
