import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import type { erbscheinNachlassgerichtPages } from "./pages";

export type ErbscheinNachlassGerichtUserData = UserDataFromPagesSchema<
  typeof erbscheinNachlassgerichtPages
>;
