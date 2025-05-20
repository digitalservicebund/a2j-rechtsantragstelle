import { kontopfaendungWegweiser } from "app/domains/kontopfaendung/wegweiser";
import { beratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { beratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck";
import { geldEinklagenFormular } from "~/domains/geldEinklagen/formular";
import { geldEinklagenVorabcheck } from "~/domains/geldEinklagen/vorabcheck";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import type { Replacements } from "~/util/applyStringReplacement";
import type { Context } from "./contexts";
import type { FlowId } from "./flowIds";
import type { Guards } from "./guards.server";
import { prozesskostenhilfeFormular } from "./prozesskostenhilfe/formular";

type FlowMigration = {
  source: FlowId;
  sortedFields: string[];
  buttonUrl?: string;
};

export type FlowType = "vorabCheck" | "formFlow";

export type Flow = {
  flowType: FlowType;
  config: Config;
  guards: Guards;
  migration?: FlowMigration;
  flowTransitionConfig?: FlowTransitionConfig;
  stringReplacements?: (context: Context) => Replacements;
  asyncFlowActions?: Record<string, (request: Request) => Promise<void>>;
};

export const flows = {
  "/beratungshilfe/antrag": beratungshilfeFormularUserData,
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "/geld-einklagen/formular": geldEinklagenFormular,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/fluggastrechte/formular": fluggastrechtFlow,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormular,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiser,
} satisfies Record<FlowId, Flow>;
