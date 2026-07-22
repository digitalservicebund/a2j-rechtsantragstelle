import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { nachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { verstorbenePersonFlowConfig } from "~/domains/nachlass/erbschein/anfrage/verstorbene-person/flowConfig";
import { antragstellendePersonFlowConfig } from "~/domains/nachlass/erbschein/anfrage/antragstellende-person/flowConfig";
import { testamentOderErbvertragFlowConfig } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/flowConfig";
import { ehepartnerFlowConfig } from "~/domains/nachlass/erbschein/anfrage/ehepartner/flowConfig";
import { angehoerigeFlowConfig } from "~/domains/nachlass/erbschein/anfrage/angehoerige/flowConfig";
import { nachlassFlowConfig } from "~/domains/nachlass/erbschein/anfrage/nachlass/flowConfig";

export const nachlassErbscheinAnfrageFlowConfig = compileFlow({
  pages: nachlassErbscheinAnfragePages,
  initialStep: "start",
  transitions: {
    start: "datenverarbeitung",
    datenverarbeitung: [
      {
        guard: (data) => data.datenverarbeitungZustimmung === "on",
        target: "verstorbeneName",
      },
    ],
    ...verstorbenePersonFlowConfig,
    ...antragstellendePersonFlowConfig,
    ...testamentOderErbvertragFlowConfig,
    ...ehepartnerFlowConfig,
    ...angehoerigeFlowConfig,
    ...nachlassFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
