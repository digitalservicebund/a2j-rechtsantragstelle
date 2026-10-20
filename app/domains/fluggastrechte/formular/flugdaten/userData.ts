import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type fluggastrechteFlugdatenPages } from "./pages";

export type FluggastrechteFlugdatenUserData = InferredUserData<
  typeof fluggastrechteFlugdatenPages
>;
