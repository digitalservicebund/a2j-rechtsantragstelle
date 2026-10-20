import { type GeldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type GeldEinklagenAnwaltschaftUserData =
  InferredUserData<GeldEinklagenAnwaltschaftPages>;
