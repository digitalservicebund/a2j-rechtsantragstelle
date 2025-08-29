import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenAbzuegePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/pages";

export type ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData =
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenAbzuegePages> & {
    pageData?: {
      arrayIndexes: number[];
    };
  };
