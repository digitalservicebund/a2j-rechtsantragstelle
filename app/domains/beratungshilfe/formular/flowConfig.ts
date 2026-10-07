import {
  type CompiledFlow,
  compileFlow,
} from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import { beratungshilfeAntragPages } from "./pages";
import { grundvoraussetzungFlowConfig } from "./grundvoraussetzung/flowConfig";
import { anwaltlicheVertretungFlowConfig } from "./anwaltlicheVertretung/flowConfig";
import { rechtsproblemFlowConfig } from "./rechtsproblem/flowConfig";
import { finanzielleAngabenFlowConfig } from "./finanzielleAngaben/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { abgabeFlowConfig } from "./abgabe/flowConfig";

const beratungshilfeAntragPagesWithLeadingSlash = addLeadingSlashToPageSchemas(
  beratungshilfeAntragPages,
);

export const beratungshilfeFormularFlowConfig = compileFlow({
  pages: beratungshilfeAntragPagesWithLeadingSlash,
  initialStep: "start",
  transitions: {
    start: "rechtsschutzversicherung",
    ...grundvoraussetzungFlowConfig,
    ...anwaltlicheVertretungFlowConfig,
    ...rechtsproblemFlowConfig,
    ...finanzielleAngabenFlowConfig,
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
            .every(([, subflowDone]) => Boolean(subflowDone)),
        target: "zusammenfassung",
      },
      {
        target: "ueberpruefung",
      },
    ],
    ...abgabeFlowConfig,
  },
  pruningStrategy: "cascading",
}) as CompiledFlow<PageConfigMap>;
