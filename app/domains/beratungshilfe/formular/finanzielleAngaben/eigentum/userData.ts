import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenEigentumPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEigentumUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenEigentumPages
>;
