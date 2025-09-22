import { kontopfaendungWegweiser } from "app/domains/kontopfaendung/wegweiser";
import { beratungshilfeFormular } from "~/domains/beratungshilfe/formular";
import { beratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import type { Config } from "~/services/flow/server/types";
import type { Replacements } from "~/util/applyStringReplacement";
import type { FlowId } from "./flowIds";
import type { Guards } from "./guards.server";
import { prozesskostenhilfeFormular } from "./prozesskostenhilfe/formular";
import type { UserData } from "./userData";
import { geldEinklagenFormular } from "./geldEinklagen/formular";

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
  stringReplacements?: (context: UserData) => Replacements;
  asyncFlowActions?: Record<
    string,
    (request: Request, userData: UserData) => Promise<void>
  >;
};

export const flows = {
  "/beratungshilfe/antrag": beratungshilfeFormular,
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/fluggastrechte/formular": fluggastrechtFlow,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormular,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiser,
  "/geld-einklagen/formular": geldEinklagenFormular,
} satisfies Record<FlowId, Flow>;
