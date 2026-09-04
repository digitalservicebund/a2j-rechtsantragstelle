import {
  CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "./pages";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";

export const prozesskostenhilfeFormularFlowConfig = compileFlow({
  pages: prozesskostenhilfeFormularPages,
  initialStep: "start",
  transitions: {
    start: "start",
    ...grundvoraussetzungenFlowConfig,
    ...rechtsschutzversicherungFlowConfig,
    ...persoenlicheDatenFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
