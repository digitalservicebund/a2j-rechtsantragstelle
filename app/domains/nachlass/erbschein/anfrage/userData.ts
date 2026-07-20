import { type nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type PageData } from "~/services/flow/pageDataSchema";

export type NachlassErbscheinAnfrageUserData = InferredUserData<
  typeof nachlassErbscheinAnfragePages
> & {
  pageData?: PageData;
};
