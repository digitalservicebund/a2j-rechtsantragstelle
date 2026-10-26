import type { FluggastrechteFormularPages } from "../pages";
import type { TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const abgabeFlowConfig = {
  abgabe: null,
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
