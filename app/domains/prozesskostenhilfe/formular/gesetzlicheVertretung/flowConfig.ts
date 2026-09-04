import {
  compileFlow,
  CompiledFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { pkhFormularGesetzlicheVertretungPages } from "./pages";
import { hasGesetzlicheVertretungYes } from "./guards";

export const gesetzlicheVertretungFlowConfig = compileFlow({
  pages: pkhFormularGesetzlicheVertretungPages,
  initialStep: "gesetzlicheVertretungFrage",
  transitions: {
    gesetzlicheVertretungFrage: [
      {
        guard: (context) => hasGesetzlicheVertretungYes({ context }),
        target: "gesetzlicheVertretungDaten",
      },
      { target: null },
    ],
    gesetzlicheVertretungDaten: null,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
