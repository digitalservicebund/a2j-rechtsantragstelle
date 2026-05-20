import { type nachlassErbausschlagungAnfragePages } from "~/domains/nachlass/erbausschlagung/anfrage/pages";
import type { UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type PageData } from "~/services/flow/pageDataSchema";

export type NachlassErbausschlagungAnfrageUserData = UserDataFromPagesSchema<
  typeof nachlassErbausschlagungAnfragePages
> & { pageData?: PageData };
