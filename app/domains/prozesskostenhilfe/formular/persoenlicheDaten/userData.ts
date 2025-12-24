import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularPersoenlicheDatenPages } from "~/domains/prozesskostenhilfe/formular/persoenlicheDaten/pages";

export type ProzesskostenhilfePersoenlicheDatenUserData =
  UserDataFromPagesSchema<typeof pkhFormularPersoenlicheDatenPages>;
