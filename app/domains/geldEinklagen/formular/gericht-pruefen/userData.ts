import { type UserDataFromPagesSchema } from "~/domains/types";
import { type geldEinklagenGerichtPruefenPages } from "./pages";

export type GeldEinklagenFormularGerichtPruefenUserData =
  UserDataFromPagesSchema<typeof geldEinklagenGerichtPruefenPages>;
