import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenPartnerPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenPartnerUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenPartnerPages
>;
