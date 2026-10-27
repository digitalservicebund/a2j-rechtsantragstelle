import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type geldEinklagenGerichtPruefenPages } from "./pages";

export type GeldEinklagenFormularGerichtPruefenUserData = InferredUserData<
  typeof geldEinklagenGerichtPruefenPages
>;
