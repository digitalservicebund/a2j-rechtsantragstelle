import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { type PageData } from "~/services/flow/pageData";

export type PartnerEinkuenfteUserData = UserDataFromPagesSchema<
  typeof pkhFormularFinanzielleAngabenPartnerPages
> & { pageData?: PageData };
