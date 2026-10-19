import type { InferredUserData } from "~/services/flow/newFlowEngine/types";
import type { erbscheinNachlassgerichtPages } from "./pages";

export type ErbscheinNachlassGerichtUserData = InferredUserData<
  typeof erbscheinNachlassgerichtPages
>;
