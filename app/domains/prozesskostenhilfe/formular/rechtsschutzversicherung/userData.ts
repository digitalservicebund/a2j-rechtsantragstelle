import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularRechtsschutzversicherungPages } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/pages";

export type ProzesskostenhilfeRechtsschutzversicherungUserData =
  UserDataFromPagesSchema<typeof pkhFormularRechtsschutzversicherungPages>;
