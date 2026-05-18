import { type nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";

export type NachlassErbausschlagungAnfrageUserData = UserDataFromPagesSchema<
  typeof nachlassErbausschlagungAnfragePages
>;
