import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type beratungshilfeAntragPages } from "../pages";
export type BeratungshilfeGrundvoraussetzungenUserData = UserDataFromPagesSchema<
  typeof beratungshilfeAntragPages
>;
