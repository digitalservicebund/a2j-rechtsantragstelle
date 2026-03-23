import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import { PageData } from "~/services/flow/pageDataSchema";

export type PartnerEinkuenfteUserData = UserDataFromPagesSchema<
  typeof pkhFormularFinanzielleAngabenPartnerPages
> & { pageData?: PageData };
