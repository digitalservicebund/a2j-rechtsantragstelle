import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type geldEinklagenKlageErstellenPages } from "./pages";

export type GeldEinklagenFormularKlageErstellenUserData =
  UserDataFromPagesSchema<typeof geldEinklagenKlageErstellenPages>;
