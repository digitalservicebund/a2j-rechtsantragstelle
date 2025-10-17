import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type geldEinklagenGerichtPruefenPages } from "./pages";

export type GeldEinklagenFormularGerichtPruefenUserData =
  UserDataFromPagesSchema<typeof geldEinklagenGerichtPruefenPages>;
