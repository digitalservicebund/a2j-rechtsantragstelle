import { type fluggastrechtePersoenlicheDatenPages } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type PageData } from "~/services/flow/pageDataSchema";

export type FluggastrechtePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof fluggastrechtePersoenlicheDatenPages
> & { pageData?: PageData };
