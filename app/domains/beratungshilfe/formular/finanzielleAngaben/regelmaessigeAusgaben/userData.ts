import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData =
  InferredUserData<
    typeof berhAntragFinanzielleAngabenRegelmassigeAusgabenPages
  >;
