import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import type { beratungshilfeVorabcheckPages } from "./pages";

export type BeratungshilfeVorabcheckUserData = UserDataFromPagesSchema<
  typeof beratungshilfeVorabcheckPages
>;
