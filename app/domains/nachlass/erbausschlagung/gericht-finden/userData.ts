import { type erbausschlagungGerichtFindenPages } from "~/domains/nachlass/erbausschlagung/gericht-finden/pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type ErbausschlagungGerichtFindenUserData = InferredUserData<
  typeof erbausschlagungGerichtFindenPages
>;
