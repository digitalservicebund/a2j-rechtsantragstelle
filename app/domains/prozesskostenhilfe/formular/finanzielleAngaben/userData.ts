import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";

export type ProzesskostenhilfeFinanzielleAngabenUserData =
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenPages> & {
    pageData?: {
      arrayIndexes: number[];
    };
  };
