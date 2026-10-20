import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenEigentumPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEigentumUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenEigentumPages
>;
