import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenAbzuegePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/pages";
import { type PageData } from "~/services/flow/pageDataSchema";

export type ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData =
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenAbzuegePages> & {
    pageData?: PageData;
  };
