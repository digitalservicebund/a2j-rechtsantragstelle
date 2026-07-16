import { type nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type PageData } from "~/services/flow/pageDataSchema";

export type NachlassErbscheinAnfrageUserData = UserDataFromPagesSchema<
  typeof nachlassErbscheinAnfragePages
> & {
  pageData?: PageData;
};
