import { type nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type NachlassErbscheinAnfrageUserData = InferredUserData<
  typeof nachlassErbscheinAnfragePages
>;
