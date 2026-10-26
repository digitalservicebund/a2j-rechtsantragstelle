import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenPartnerPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenPartnerUserData = InferredUserData<
  typeof berhAntragFinanzielleAngabenPartnerPages
>;
