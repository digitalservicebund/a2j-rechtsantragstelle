import { type fluggastrechteProzessfuehrungPages } from "~/domains/fluggastrechte/formular/prozessfuehrung/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type FluggastrechteProzessfuehrungUserData = UserDataFromPagesSchema<
  typeof fluggastrechteProzessfuehrungPages
>;
