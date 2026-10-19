import type { InferredUserData } from "~/services/flow/newFlowEngine/types";
import type { kontopfaendungPkontoAntragPages } from "./pages";

export type KontopfaendungPkontoAntragUserData = InferredUserData<
  typeof kontopfaendungPkontoAntragPages
>;
