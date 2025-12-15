import type { FlowId } from "./flowIds";
import type { Flow } from "./flows.server";
import { kontopfaendungWegweiser } from "./kontopfaendung/wegweiser";
import { beratungshilfeVorabcheck } from "./beratungshilfe/vorabcheck";
import { fluggastrechteVorabcheck } from "./fluggastrechte/vorabcheck";

export const vorabcheckFlows = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiser,
} satisfies Partial<Record<FlowId, Flow>>;
