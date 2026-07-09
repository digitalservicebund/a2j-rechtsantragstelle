import { type nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type NachlassErbscheinAnfrageUserData = UserDataFromPagesSchema<
  typeof nachlassErbscheinAnfragePages
>;
