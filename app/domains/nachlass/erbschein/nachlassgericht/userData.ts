import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import type { nachlassErbscheinNachlassgerichtPages } from "./pages";

export type NachlassErbscheinNachlassGerichtUserData = UserDataFromPagesSchema<
  typeof nachlassErbscheinNachlassgerichtPages
>;
