import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenEinkuenftePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/pages";
import { type PageData } from "~/services/flow/pageDataSchema";

export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData =
  UserDataFromPagesSchema<
    typeof pkhFormularFinanzielleAngabenEinkuenftePages
  > & { pageData?: PageData };
