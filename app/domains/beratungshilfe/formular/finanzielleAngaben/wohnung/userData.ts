import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenWohnungPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenWohnungUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenWohnungPages
>;
