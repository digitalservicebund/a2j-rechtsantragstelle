import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type beratungshilfeAntragPages } from "../pages";
export type BeratungshilfeAnwaltlicheVertretungUserData = UserDataFromPagesSchema<
  typeof beratungshilfeAntragPages
>;
