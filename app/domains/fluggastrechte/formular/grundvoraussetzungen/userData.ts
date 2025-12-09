import type { fluggastrechteGrundvoraussetzungenPages } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/pages";
import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type FluggastrechteGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof fluggastrechteGrundvoraussetzungenPages>;
