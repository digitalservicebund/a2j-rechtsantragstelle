import { type fluggastrechteProzessfuehrungPages } from "~/domains/fluggastrechte/formular/prozessfuehrung/pages";
import { type UserDataFromPagesSchema } from "~/domains/types";

export type FluggastrechteProzessfuehrungUserData = UserDataFromPagesSchema<
  typeof fluggastrechteProzessfuehrungPages
>;
