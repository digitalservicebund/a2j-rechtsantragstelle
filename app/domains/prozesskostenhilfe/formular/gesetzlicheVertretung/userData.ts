import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";

export type ProzesskostenhilfeGesetzlicheVertretungUserData =
  UserDataFromPagesSchema<typeof pkhFormularGesetzlicheVertretungPages>;
