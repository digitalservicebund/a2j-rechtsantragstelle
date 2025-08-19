import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragPersoenlicheDatenPages } from "./pages";

export type BeratungshilfePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof berHAntragPersoenlicheDatenPages
>;
