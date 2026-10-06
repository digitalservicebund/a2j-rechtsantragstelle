import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type GeldEinklagenAnwaltschaftUserData =
  InferredUserData<GeldEinklagenAnwaltschaftPages>;
