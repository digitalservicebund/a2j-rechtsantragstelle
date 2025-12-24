import { type fluggastrechtePersoenlicheDatenPages } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import { type UserDataFromPagesSchema } from "~/domains/types";

export type FluggastrechtePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof fluggastrechtePersoenlicheDatenPages
> & {
  pageData?: {
    arrayIndexes: number[];
  };
};
