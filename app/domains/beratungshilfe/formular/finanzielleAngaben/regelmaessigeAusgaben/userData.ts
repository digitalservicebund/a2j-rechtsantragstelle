import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData =
  InferredUserData<
    typeof berhAntragFinanzielleAngabenRegelmassigeAusgabenPages
  >;
