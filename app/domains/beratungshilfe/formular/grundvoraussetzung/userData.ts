import { type UserDataFromPagesSchema } from "~/domains/types";
import { type berHAntragGrundvoraussetzungenPages } from "./pages";

export type BeratungshilfeGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof berHAntragGrundvoraussetzungenPages>;
