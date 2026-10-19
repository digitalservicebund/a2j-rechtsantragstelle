import type { InferredUserData } from "~/services/flow/newFlowEngine/types";
import type { beratungshilfeVorabcheckPages } from "./pages";

export type BeratungshilfeVorabcheckUserData = InferredUserData<
  typeof beratungshilfeVorabcheckPages
>;
