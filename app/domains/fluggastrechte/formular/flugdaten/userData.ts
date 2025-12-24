import type { UserDataFromPagesSchema } from "~/domains/types";
import { type fluggastrechteFlugdatenPages } from "./pages";

export type FluggastrechteFlugdatenUserData = UserDataFromPagesSchema<
  typeof fluggastrechteFlugdatenPages
>;
