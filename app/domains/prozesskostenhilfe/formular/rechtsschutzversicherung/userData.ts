import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularRechtsschutzversicherungPages } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/pages";

export type ProzesskostenhilfeRechtsschutzversicherungUserData =
  UserDataFromPagesSchema<typeof pkhFormularRechtsschutzversicherungPages>;
