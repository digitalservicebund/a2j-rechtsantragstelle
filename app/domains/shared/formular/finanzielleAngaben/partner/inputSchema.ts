import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type finanzielleAngabenPartnerPages } from "~/domains/shared/formular/finanzielleAngaben/partner/pages";
export type FinanzielleAngabenPartnerUserData = UserDataFromPagesSchema<
  typeof finanzielleAngabenPartnerPages
>;
