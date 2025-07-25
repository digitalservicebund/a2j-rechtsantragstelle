import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type berHAntragGrundvoraussetzungenPages } from "./pages";

export type BeratungshilfeGrundvoraussetzungenUserData =
  UserDataFromPagesSchema<typeof berHAntragGrundvoraussetzungenPages>;
