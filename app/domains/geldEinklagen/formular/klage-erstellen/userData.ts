import { type geldEinklagenKlageErstellenPages } from "./pages";
import { type InferredUserData } from "~/services/flow/newFlowEngine/types";

export type GeldEinklagenFormularKlageErstellenUserData = InferredUserData<
  typeof geldEinklagenKlageErstellenPages
>;
