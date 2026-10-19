import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenWohnungPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenWohnungUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenWohnungPages
>;
