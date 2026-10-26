import { type InferredUserData } from "~/services/flow/flowEngine/types";
import { type berhAntragFinanzielleAngabenEinkommenPages } from "./pages";

export type BeratungshilfeFinanzielleAngabenEinkommenUserData =
  InferredUserData<typeof berhAntragFinanzielleAngabenEinkommenPages>;
