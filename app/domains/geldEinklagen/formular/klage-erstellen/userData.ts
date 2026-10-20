import { type geldEinklagenKlageErstellenPages } from "./pages";
import { type InferredUserData } from "~/services/flow/flowEngine/types";

export type GeldEinklagenFormularKlageErstellenUserData = InferredUserData<
  typeof geldEinklagenKlageErstellenPages
>;
