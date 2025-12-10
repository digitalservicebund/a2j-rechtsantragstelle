import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type fluggastrechteFlugdatenPages } from "./pages";

export type FluggastrechteFlugdatenUserData = UserDataFromPagesSchema<
  typeof fluggastrechteFlugdatenPages
>;
