import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type persoenlicheDatenPages } from "~/domains/shared/formular/persoenlicheDaten/pages";

export type BeratungshilfePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof persoenlicheDatenPages
>;
