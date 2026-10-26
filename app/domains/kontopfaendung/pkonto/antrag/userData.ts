import type { InferredUserData } from "~/services/flow/flowEngine/types";
import type { kontopfaendungPkontoAntragPages } from "./pages";

export type KontopfaendungPkontoAntragUserData = InferredUserData<
  typeof kontopfaendungPkontoAntragPages
>;
