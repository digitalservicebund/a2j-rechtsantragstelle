import { type fluggastrechteStreitwertKostenPages } from "~/domains/fluggastrechte/formular/streitwertKosten/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type FluggastrechteStreitwertKostenUserData = UserDataFromPagesSchema<
  typeof fluggastrechteStreitwertKostenPages
>;
