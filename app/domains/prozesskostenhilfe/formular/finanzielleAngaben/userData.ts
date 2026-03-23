import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import { PageData } from "~/services/flow/pageDataSchema";

export type ProzesskostenhilfeFinanzielleAngabenUserData =
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenPages> & {
    pageData?: PageData;
  };
