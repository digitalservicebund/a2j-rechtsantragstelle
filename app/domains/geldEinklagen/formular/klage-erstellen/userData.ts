import { type UserDataFromPagesSchema } from "~/domains/types";
import { type geldEinklagenKlageErstellenPages } from "./pages";

export type GeldEinklagenFormularKlageErstellenUserData =
  UserDataFromPagesSchema<typeof geldEinklagenKlageErstellenPages>;
