import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type fluggastrechteFlugdatenPages } from "./pages";

export type FluggastrechteFlugdatenUserData = InferredUserData<
  typeof fluggastrechteFlugdatenPages
>;
