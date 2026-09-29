import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenKinderPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenKinderUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenKinderPages
>;
