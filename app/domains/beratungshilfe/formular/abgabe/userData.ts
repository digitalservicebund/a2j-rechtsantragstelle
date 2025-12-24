import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragAbgabePages } from "./pages";

export type BeratungshilfeAbgabeUserData = UserDataFromPagesSchema<
  typeof berHAntragAbgabePages
>;
