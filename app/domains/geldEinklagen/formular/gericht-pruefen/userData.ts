import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type geldEinklagenGerichtPruefenPages } from "./pages";

export type GeldEinklagenFormularGerichtPruefenUserData = InferredUserData<
  typeof geldEinklagenGerichtPruefenPages
>;
