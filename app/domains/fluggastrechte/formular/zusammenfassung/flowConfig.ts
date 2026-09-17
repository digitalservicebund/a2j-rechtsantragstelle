import { fromXStateGuard } from "../flowConfigGuards";
import { fluggastrechteGuards } from "../guards";
import type { FluggastrechteFormularPages } from "../pagesNewFlowEngine";
import type { TransitionConfigMap } from "~/services/flow/newFlowEngine/types";

export const zusammenfassungFlowConfig = {
  zusammenfassungStart: [
    {
      target: "abgabe",
      guard: fromXStateGuard(fluggastrechteGuards.isClaimNotExceedingLimit),
    },
  ],
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
