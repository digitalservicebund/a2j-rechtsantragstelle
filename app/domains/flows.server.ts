import { beratungshilfeFormular } from "~/domains/beratungshilfe/formular";
import { beratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import { fluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck";
import { geldEinklagenFormular } from "~/domains/geldEinklagen/formular";
import { geldEinklagenVorabcheck } from "~/domains/geldEinklagen/vorabcheck";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { FlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";
import type { Replacements } from "~/util/fillTemplate";
import type { Context } from "./contexts";
import type { FlowId } from "./flowIds";
import type { Guards } from "./guards.server";
import { prozesskostenhilfeFormular } from "./prozesskostenhilfe/formular";

export type FlowMigration = {
  source: FlowId;
  sortedFields: string[];
  buttonUrl?: string;
};

const flowTypes = ["vorabCheck", "formFlow"] as const;
export type FlowType = (typeof flowTypes)[number];

export type Flow = {
  flowType: FlowType;
  config: Config;
  guards: Guards;
  migration?: FlowMigration;
  flowTransitionConfig?: FlowTransitionConfig;
  stringReplacements?: (context: Context) => Replacements;
};

export const flows = {
  "/beratungshilfe/antrag": beratungshilfeFormular,
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheck,
  "/geld-einklagen/vorabcheck": geldEinklagenVorabcheck,
  "/geld-einklagen/formular": geldEinklagenFormular,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheck,
  "/fluggastrechte/formular": fluggastrechtFlow,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormular,
} satisfies Record<FlowId, Flow>;
