import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { prozesskostenhilfeFormularPages } from "./pages";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";
import { antragstellendePersonFlowConfig } from "./antragstellendePerson/flowConfig";
import { gesetzlicheVertretungFlowConfig } from "./gesetzlicheVertretung/flowConfig";
import { finanzielleAngabenFlowConfig } from "./finanzielleAngaben/flowConfig";
import { abgabeFlowConfig } from "./abgabe/flowConfig";

export const prozesskostenhilfeFormularFlowConfig = compileFlow({
  pages: prozesskostenhilfeFormularPages,
  initialStep: "start",
  transitions: {
    start: "nachueberpruefungFrage",
    ...grundvoraussetzungenFlowConfig,
    ...antragstellendePersonFlowConfig,
    ...rechtsschutzversicherungFlowConfig,
    ...finanzielleAngabenFlowConfig,
    ...gesetzlicheVertretungFlowConfig,
    ...persoenlicheDatenFlowConfig,
    weitereAngaben: null,
    ...abgabeFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
