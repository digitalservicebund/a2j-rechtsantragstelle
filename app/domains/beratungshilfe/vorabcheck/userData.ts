import type { UserDataFromPagesSchema } from "~/domains/pageConfig";
import type { beratungshilfeVorabcheckPages } from "./pages";

export type BeratungshilfeVorabcheckUserData = UserDataFromPagesSchema<
  typeof beratungshilfeVorabcheckPages
>;
