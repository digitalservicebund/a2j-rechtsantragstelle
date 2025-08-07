import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragRechtsproblemPages } from "./pages";

export type BeratungshilfeRechtsproblemUserData = UserDataFromPagesSchema<
  typeof berHAntragRechtsproblemPages
>;
