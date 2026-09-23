import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { addLeadingSlashToPageSchemas } from "~/services/flow/addLeadingSlashToPageConfig";
import { compileFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { abgabeFlowConfig } from "./abgabe/flowConfig";
import { flugdatenFlowConfig } from "./flugdaten/flowConfig";
import { grundvoraussetzungenFlowConfig } from "./grundvoraussetzungen/flowConfig";
import { introFlowConfig } from "./intro/flowConfig";
import { persoenlicheDatenFlowConfig } from "./persoenlicheDaten/flowConfig";
import { prozessfuehrungFlowConfig } from "./prozessfuehrung/flowConfig";
import { streitwertKostenFlowConfig } from "./streitwertKosten/flowConfig";
import { zusammenfassungFlowConfig } from "./zusammenfassung/flowConfig";

const fluggastrechteFormularPagesWithLeadingSlash =
  addLeadingSlashToPageSchemas(fluggastrechteFormularPages);

export const fluggastrechteFormularFlowConfig = compileFlow({
  pages: fluggastrechteFormularPagesWithLeadingSlash,
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
