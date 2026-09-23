import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import type { FluggastrechteFormularPages } from "../pages";

export const introFlowConfig = {
  intro: "grundvoraussetzungenStreitbeilegung",
  redirectVorabcheckErgebnis: null,
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
