import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenEinkommenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEinkommenUserData =
  InferredUserData<typeof berhAntragFinanzielleAngabenEinkommenPages>;
