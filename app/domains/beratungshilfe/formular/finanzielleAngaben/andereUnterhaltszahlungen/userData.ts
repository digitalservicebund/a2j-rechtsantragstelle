import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData =
  InferredUserData<
    typeof berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages
  >;
