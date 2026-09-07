import { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { rechtsschutzversicherungFlowConfig } from "./rechtsschutzversicherung/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { gesetzlicheVertretungFlowConfig } from "./gesetzlicheVertretung/flowConfig";
import { readyForAbgabe } from "./abgabe/guards";
import { antragstellendePersonFlowConfig } from "./antragstellendePerson/flowConfig";
import { finanzielleAngabenFlowConfig } from "./finanzielleAngaben/flowConfig";

export const prozesskostenhilfeFormularFlowConfig = {
  start: "start",
  ...grundvoraussetzungenFlowConfig,
  ...rechtsschutzversicherungFlowConfig,
  ...finanzielleAngabenFlowConfig,
  ...gesetzlicheVertretungFlowConfig,
  ...antragstellendePersonFlowConfig,
  ...persoenlicheDatenFlowConfig,
  weitereAngaben: null,
  abgabeUeberpruefung: [
    {
      guard: (context: any) => readyForAbgabe({ context }),
      target: "zusammenfassung",
    },
  ],
  zusammenfassung: "ende",
  ende: null,
  pruningStrategy: "cascading",
};
