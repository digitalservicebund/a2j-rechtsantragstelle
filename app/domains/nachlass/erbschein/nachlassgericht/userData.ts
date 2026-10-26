import type { InferredUserData } from "~/services/flow/flowEngine/types";
import type { erbscheinNachlassgerichtPages } from "./pages";

export type ErbscheinNachlassGerichtUserData = InferredUserData<
  typeof erbscheinNachlassgerichtPages
>;
