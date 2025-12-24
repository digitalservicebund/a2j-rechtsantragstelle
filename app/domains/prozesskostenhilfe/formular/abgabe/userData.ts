import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularAbgabePages } from "~/domains/prozesskostenhilfe/formular/abgabe/pages";

export type ProzesskostenhilfeAbgabeUserData = UserDataFromPagesSchema<
  typeof pkhFormularAbgabePages
>;
