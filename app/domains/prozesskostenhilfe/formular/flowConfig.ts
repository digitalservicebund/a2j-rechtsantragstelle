import {
  CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { prozesskostenhilfeFormularPages } from "./pages";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { gesetzlicheVertretungFlowConfig } from "./gesetzlicheVertretung/flowConfig";
import { readyForAbgabe } from "./abgabe/guards";
import { antragstellendePersonFlowConfig } from "./antragstellendePerson/flowConfig";

export const prozesskostenhilfeFormularFlowConfig = compileFlow({
  pages: prozesskostenhilfeFormularPages,
  initialStep: "start",
  transitions: {
      start: "start",
      ...grundvoraussetzungenFlowConfig,
      ...rechtsschutzversicherungFlowConfig,
      ...finanziellenAngabenFlowConfig,
      ...gesetzlicheVertretungFlowConfig,
      ...antragstellendePersonFlowConfig,
      ...persoenlicheDatenFlowConfig,
      weitereAngaben: null,
      abgabeUeberpruefung: [
       {
        guard: (context) => readyForAbgabe({ context }),
        target: "zusammenfassung",
       }
      ],
      zusammenfassung: "ende",
      ende: null
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
