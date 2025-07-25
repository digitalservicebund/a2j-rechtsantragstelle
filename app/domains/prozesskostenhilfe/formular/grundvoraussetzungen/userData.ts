import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";

export type ProzesskostenhilfeGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof pkhFormularGrundvoraussetzungenPages>;
