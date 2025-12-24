import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragPersoenlicheDatenPages } from "./pages";

export type BeratungshilfePersoenlicheDatenUserData = UserDataFromPagesSchema<
  typeof berHAntragPersoenlicheDatenPages
>;
