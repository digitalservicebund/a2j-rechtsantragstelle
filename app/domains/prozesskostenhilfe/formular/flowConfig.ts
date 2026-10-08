import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { prozesskostenhilfeFormularPages } from "./pages";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { isNachueberpruefung } from "./grundvoraussetzungen/guards";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";
import { antragstellendePersonFlowConfig } from "./antragstellendePerson/flowConfig";
import { gesetzlicheVertretungFlowConfig } from "./gesetzlicheVertretung/flowConfig";
import { finanzielleAngabenFlowConfig } from "./finanzielleAngaben/flowConfig";
import { abgabeFlowConfig } from "./abgabe/flowConfig";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

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
    weitereAngaben: [
      {
        guard: (context) =>
          !!context.pageData?.subflowDoneStates &&
          Object.entries(context.pageData.subflowDoneStates)
            // Top level sections only, subsections can be unreachable and therefore never done
            .filter(
              ([stepId]) =>
                stepId.split("/").length === 2 && stepId !== "/abgabe",
            )
            // Nachueberpruefung skips rechtsschutzversicherung, so it is never done
            .filter(
              ([stepId]) =>
                !(
                  stepId === "/rechtsschutzversicherung" &&
                  isNachueberpruefung({ context })
                ),
            )
            .every(([, subflowDone]) => Boolean(subflowDone)),
        target: "zusammenfassung",
      },
      {
        target: "abgabeUeberpruefung",
      },
    ],
    ...abgabeFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
