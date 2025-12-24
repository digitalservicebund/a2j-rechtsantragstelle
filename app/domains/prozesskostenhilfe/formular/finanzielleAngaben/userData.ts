import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";

export type ProzesskostenhilfeFinanzielleAngabenUserData =
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenPages> & {
    pageData?: {
      arrayIndexes: number[];
    };
  };
