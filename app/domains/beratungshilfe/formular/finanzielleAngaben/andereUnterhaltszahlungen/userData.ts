import { type InferredUserData } from "~/services/flow/newFlowEngine/types";
import { type berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData =
  InferredUserData<
    typeof berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages
  >;
