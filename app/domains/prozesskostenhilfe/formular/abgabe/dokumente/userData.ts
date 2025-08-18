import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularDokumentePages } from "~/domains/prozesskostenhilfe/formular/abgabe/dokumente/pages";

export type ProzesskostenhilfeDokumenteUserData = UserDataFromPagesSchema<
  typeof pkhFormularDokumentePages
>;
