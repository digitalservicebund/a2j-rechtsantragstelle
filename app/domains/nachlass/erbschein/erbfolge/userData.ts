import { type nachlassErbfolgePages } from "~/domains/nachlass/erbschein/erbfolge/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type NachlassErbscheinErbfolgeUserData = InferredUserData<
  typeof nachlassErbfolgePages
>;
