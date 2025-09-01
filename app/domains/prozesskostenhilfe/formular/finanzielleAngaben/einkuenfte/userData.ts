import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData =
  UserDataFromPagesSchema<
    typeof pkhFormularFinanzielleAngabenEinkuenftePages
  > & {
    pageData?: {
      arrayIndexes: number[];
    };
  };
