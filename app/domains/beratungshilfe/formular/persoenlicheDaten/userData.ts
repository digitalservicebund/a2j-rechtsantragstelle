import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type sharedPersoenlicheDatenPages } from "~/domains/shared/formular/persoenlicheDaten/pages";

export type BeratungshilfePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof sharedPersoenlicheDatenPages
>;
