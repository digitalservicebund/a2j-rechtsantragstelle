import type { fluggastrechteGrundvoraussetzungenPages } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/pages";
import type { UserDataFromPagesSchema } from "~/domains/types";

export type FluggastrechteGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof fluggastrechteGrundvoraussetzungenPages>;
