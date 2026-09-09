import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { type prozesskostenhilfeFormularPages } from "../pages";
import { abzuegeFlowConfig } from "./abzuege/flowConfig";
import { andereUnterhaltszahlungenFlowConfig } from "./andere-unterhaltszahlungen/flowConfig";
import { ausgabenFlowConfig } from "./ausgaben/flowConfig";
import { eigentumFlowConfig } from "./eigentum/flowConfig";
import { einkuenfteFlowConfig } from "./einkuenfte/flowConfig";
import { kinderFlowConfig } from "./kinder/flowConfig";
import { wohnungFlowConfig } from "./wohnung/flowConfig";
import { partnerFlowConfig } from "./partner/flowConfig";

export const finanzielleAngabenFlowConfig = {
  ...einkuenfteFlowConfig,
  ...abzuegeFlowConfig,
  ...partnerFlowConfig,
  ...kinderFlowConfig,
  ...andereUnterhaltszahlungenFlowConfig,
  ...wohnungFlowConfig,
  ...eigentumFlowConfig,
  ...ausgabenFlowConfig,
} satisfies Partial<
  TransitionConfigMap<typeof prozesskostenhilfeFormularPages>
>;
