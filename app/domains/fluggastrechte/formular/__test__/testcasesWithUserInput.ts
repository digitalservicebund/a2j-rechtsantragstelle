import type { FlowTestConfig } from "~/domains/__test__/TestCases";
import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteFormularFlowConfig } from "../flowConfig";
import { fluggastrechtFlow } from "..";
import type { FluggastrechteUserData } from "../userData";
import { fluggastrechteFormularHappyPathData } from "./mockTestData";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugNo";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugYes";
import { testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse } from "../flugdaten/__test__/testcasesFluggesellschaftAddresse";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "../flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "../flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "../grundvoraussetzungen/__test__/testcases";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "../persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteFormularProzessfuehrung } from "../prozessfuehrung/__test__/testcases";
import { testCasesFluggastrechteFormularStreitwertKosten } from "../streitwertKosten/__test__/testscases";

export const fluggastrechteFormularTestCases = {
  xstateConfig: fluggastrechtFlow.config,
  newEngineConfig: fluggastrechteFormularFlowConfig,
  testcases: {
    weiterePersonHinzufuegen: [
      {
        stepId: "/persoenliche-daten/weitere-personen/uebersicht",
        pageData: {
          subflowDoneStates: {
            "/grundvoraussetzungen": true,
            "/flugdaten": true,
          },
        },
        userInput: {
          ...fluggastrechteFormularHappyPathData,
          isWeiterePersonen: "yes",
          weiterePersonen: [],
        },
        addArrayItemEvent: "add-weiterePersonen",
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/person/0/daten",
        skipPageSchemaValidation: true,
        userInput: {
          "weiterePersonen#buchungsnummer": "ABC123",
          "weiterePersonen#anrede": "none",
          "weiterePersonen#title": "none",
          "weiterePersonen#vorname": "Erika",
          "weiterePersonen#nachname": "Mustermann",
          "weiterePersonen#strasse": "Musterstrasse",
          "weiterePersonen#hausnummer": "1",
          "weiterePersonen#plz": "10115",
          "weiterePersonen#ort": "Berlin",
          "weiterePersonen#land": "Deutschland",
          "weiterePersonen#telefonnummer": "",
          "weiterePersonen#datenverarbeitungZustimmung": "on",
        },
      },
      {
        stepId: "/persoenliche-daten/weitere-personen/uebersicht",
      },
    ],
    ...testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo,
    ...testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes,
    ...testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse,
    ...testCasesFluggastrechteFormularFlugdatenNichtBefoerderung,
    ...testCasesFluggastrechteFormularFlugdatenVerspaetet,
    ...testCasesFluggastrechteFormularPersoenlicheDaten,
    ...testCasesFluggastrechteFormularGrundvoraussetzungen,
    ...testCasesFluggastrechteFormularProzessfuehrung,
    ...testCasesFluggastrechteFormularStreitwertKosten,
  },
} satisfies FlowTestConfig<FluggastrechteUserData, PageConfigMap>;
