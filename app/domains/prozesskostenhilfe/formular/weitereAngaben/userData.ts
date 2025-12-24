import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularWeitereAngabenPages } from "~/domains/prozesskostenhilfe/formular/weitereAngaben/pages";

export type ProzesskostenhilfeWeitereAngabenUserData = UserDataFromPagesSchema<
  typeof pkhFormularWeitereAngabenPages
>;
