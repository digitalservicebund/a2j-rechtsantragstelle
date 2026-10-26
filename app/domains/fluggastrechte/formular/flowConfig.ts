import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { compileFlow } from "~/services/flow/flowEngine/compileFlow";
import { abgabeFlowConfig } from "./abgabe/flowConfig";
import { flugdatenFlowConfig } from "./flugdaten/flowConfig";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { introFlowConfig } from "./intro/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { prozessfuehrungFlowConfig } from "./prozessfuehrung/flowConfig";
import { streitwertKostenFlowConfig } from "./streitwertKosten/flowConfig";
import { zusammenfassungFlowConfig } from "./zusammenfassung/flowConfig";

export const fluggastrechteFormularFlowConfig = compileFlow({
  pages: fluggastrechteFormularPages,
  initialStep: "intro",
  transitions: {
    ...introFlowConfig,
    ...grundvoraussetzungenFlowConfig,
    ...streitwertKostenFlowConfig,
    ...flugdatenFlowConfig,
    ...persoenlicheDatenFlowConfig,
    ...prozessfuehrungFlowConfig,
    ...zusammenfassungFlowConfig,
    ...abgabeFlowConfig,
  },
});
