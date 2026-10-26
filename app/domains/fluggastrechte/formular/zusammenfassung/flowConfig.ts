import { fluggastrechteGuards } from "../guards";
import type { FluggastrechteFormularPages } from "../pages";
import type { TransitionConfigMap } from "~/services/flow/flowEngine/types";

export const zusammenfassungFlowConfig = {
  zusammenfassungStart: [
    {
      target: "abgabe",
      guard: fluggastrechteGuards.isClaimNotExceedingLimit,
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
