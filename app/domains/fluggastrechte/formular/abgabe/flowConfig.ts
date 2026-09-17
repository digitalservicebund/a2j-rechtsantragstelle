import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";
import type { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const abgabeFlowConfig = {
  abgabe: null,
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
