import { type erbscheinWegweiserPages } from "~/domains/nachlass/erbschein/wegweiser/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type ErbscheinWegweiserUserData = InferredUserData<
  typeof erbscheinWegweiserPages
>;
