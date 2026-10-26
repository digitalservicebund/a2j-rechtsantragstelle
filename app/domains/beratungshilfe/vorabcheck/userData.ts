import type { InferredUserData } from "~/services/flow/flowEngine/types";
import type { beratungshilfeVorabcheckPages } from "./pages";

export type BeratungshilfeVorabcheckUserData = InferredUserData<
  typeof beratungshilfeVorabcheckPages
>;
