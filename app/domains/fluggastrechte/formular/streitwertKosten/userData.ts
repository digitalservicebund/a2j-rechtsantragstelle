import { type fluggastrechteStreitwertKostenPages } from "~/domains/fluggastrechte/formular/streitwertKosten/pages";
import { type UserDataFromPagesSchema } from "~/domains/types";

export type FluggastrechteStreitwertKostenUserData = UserDataFromPagesSchema<
  typeof fluggastrechteStreitwertKostenPages
>;
