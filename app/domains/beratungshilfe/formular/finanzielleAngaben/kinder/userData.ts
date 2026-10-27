import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenKinderPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenKinderUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenKinderPages
>;
