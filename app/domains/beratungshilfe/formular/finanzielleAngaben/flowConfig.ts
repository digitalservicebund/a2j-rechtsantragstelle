import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type BeratungshilfeFormularPages } from "../pages";
import { einkommenFlowConfig } from "./einkommen/flowConfig";
import { partnerFlowConfig } from "./partner/flowConfig";
import { kinderFlowConfig } from "./kinder/flowConfig";
import { andereUnterhaltszahlungenFlowConfig } from "./andereUnterhaltszahlungen/flowConfig";
import { wohnungFlowConfig } from "./wohnung/flowConfig";
import { eigentumFlowConfig } from "./eigentum/flowConfig";
import { regelmaessigeAusgabenFlowConfig } from "./regelmaessigeAusgaben/flowConfig";

export const finanzielleAngabenFlowConfig = {
  ...einkommenFlowConfig,
  ...partnerFlowConfig,
  ...kinderFlowConfig,
  ...andereUnterhaltszahlungenFlowConfig,
  ...wohnungFlowConfig,
  ...eigentumFlowConfig,
  ...regelmaessigeAusgabenFlowConfig,
} satisfies Partial<TransitionConfigMap<BeratungshilfeFormularPages>>;
