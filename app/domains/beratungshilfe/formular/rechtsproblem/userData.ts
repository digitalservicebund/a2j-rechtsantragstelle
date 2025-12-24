import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragRechtsproblemPages } from "./pages";

export type BeratungshilfeRechtsproblemUserData = UserDataFromPagesSchema<
  typeof berHAntragRechtsproblemPages
>;
