import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragAbgabePages } from "./pages";

export type BeratungshilfeAbgabeUserData = UserDataFromPagesSchema<
  typeof berHAntragAbgabePages
>;
