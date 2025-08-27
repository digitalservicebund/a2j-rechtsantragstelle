import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";

export type PartnerEinkuenfteUserData = UserDataFromPagesSchema<
  typeof pkhFormularFinanzielleAngabenPartnerPages
> & {
  pageData?: {
    arrayIndexes: number[];
  };
};
