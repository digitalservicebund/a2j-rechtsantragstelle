import { type UserDataFromPagesSchema } from "~/domains/types";
import { type pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";

export type ProzesskostenhilfeGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof pkhFormularGrundvoraussetzungenPages>;
