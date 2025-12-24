import type { UserDataFromPagesSchema } from "~/domains/types";
import type { beratungshilfeVorabcheckPages } from "./pages";

export type BeratungshilfeVorabcheckUserData = UserDataFromPagesSchema<
  typeof beratungshilfeVorabcheckPages
>;
