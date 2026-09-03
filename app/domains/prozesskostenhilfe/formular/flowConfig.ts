import {
  CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "./pages";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";

export const prozesskostenhilfeFormularFlowConfig = compileFlow({
  pages: prozesskostenhilfeFormularPages,
  initialStep: "start",
  transitions: {
    start: "start",
    ...grundvoraussetzungenFlowConfig,
    ...rechtsschutzversicherungFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
