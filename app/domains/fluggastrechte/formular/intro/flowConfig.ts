import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";

export const introFlowConfig = {
  intro: "grundvoraussetzungenStreitbeilegung",
  redirectVorabcheckErgebnis: null,
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
