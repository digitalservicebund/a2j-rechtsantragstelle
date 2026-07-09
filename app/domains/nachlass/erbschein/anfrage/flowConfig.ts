import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";

export const nachlassErbscheinAnfrageFlowConfig = compileFlow({
  pages: nachlassErbscheinAnfragePages,
  initialStep: "start",
  transitions: {
    start: "datenverarbeitung",
    datenverarbeitung: "verstorbeneName",
    verstorbeneName: null,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
