import z from "zod";
import type {
  ExpectedStep,
  FlowTestCases,
  FlowTestConfig,
  TestCases,
} from "~/domains/__test__/TestCases";
import { getPageSchema } from "~/domains/pageSchemas";
import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteFormularFlowConfig } from "../flowConfig";
import { fluggastrechtFlow } from "..";
import type { FluggastrechteUserData } from "../userData";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugNo";
import { testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes } from "../flugdaten/__test__/testcasesAnnullierungWithErsatzflugYes";
import { testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse } from "../flugdaten/__test__/testcasesFluggesellschaftAddresse";
import { testCasesFluggastrechteFormularFlugdatenNichtBefoerderung } from "../flugdaten/__test__/testcasesNichtBefoerderung";
import { testCasesFluggastrechteFormularFlugdatenVerspaetet } from "../flugdaten/__test__/testscasesVerspaetet";
import { testCasesFluggastrechteFormularGrundvoraussetzungen } from "../grundvoraussetzungen/__test__/testcases";
import { testCasesFluggastrechteFormularPersoenlicheDaten } from "../persoenlicheDaten/__test__/testcases";
import { testCasesFluggastrechteFormularProzessfuehrung } from "../prozessfuehrung/__test__/testcases";
import { testCasesFluggastrechteFormularStreitwertKosten } from "../streitwertKosten/__test__/testscases";
import { type FlowId } from "~/domains/flowIds";

const FLOW_ID: FlowId = "/fluggastrechte/formular";

type LegacyTestCase = Readonly<[FluggastrechteUserData, readonly string[]]>;

/**
 * Partial context needed to reach the first step of a partial flow
 */
const partialFlowContext: FluggastrechteUserData = {
  pageData: {
    subflowDoneStates: {
      "/grundvoraussetzungen": true,
      "/flugdaten": true,
      "/prozessfuehrung": true,
    },
  },
  prozesszinsen: "yes",
  vorname: "Max",
  nachname: "Mustermann",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "10115",
  ort: "Berlin",
  isWeiterePersonen: "no",
  fluggesellschaft: "LH",
};

const reachPartialFlowInput = (
  userData: FluggastrechteUserData,
): FluggastrechteUserData => ({
  ...partialFlowContext,
  ...userData,
  pageData: {
    ...partialFlowContext.pageData,
    ...userData.pageData,
    subflowDoneStates: {
      ...partialFlowContext.pageData?.subflowDoneStates,
      ...userData.pageData?.subflowDoneStates,
    },
  },
});

const getPageUserInput = (userData: FluggastrechteUserData, stepId: string) => {
  const pageSchema = getPageSchema(FLOW_ID + stepId);
  if (!pageSchema) return userData;

  return Object.fromEntries(
    Object.keys(pageSchema)
      .filter((fieldName) => fieldName in userData)
      .map((fieldName) => [
        fieldName,
        userData[fieldName as keyof FluggastrechteUserData],
      ]),
  ) as FluggastrechteUserData;
};

const toExpectedSteps = ([userData, stepIds]: LegacyTestCase): Array<
  ExpectedStep<FluggastrechteUserData>
> => {
  const isPartialFlow = stepIds[0] !== "/intro/start";

  return stepIds.map((stepId) => {
    // If we're starting the test midway through the flow, we need to seed the userData to reach the first desired step
    const userInput = isPartialFlow
      ? reachPartialFlowInput(userData)
      : getPageUserInput(userData, stepId);
    const pageSchema = getPageSchema(FLOW_ID + stepId);
    const hasInvalidPageInput =
      pageSchema !== undefined &&
      userInput !== undefined &&
      !z.validate(z.object(pageSchema), userInput);

    return {
      stepId,
      ...(userInput ? { userInput } : {}),
      ...(hasInvalidPageInput || (pageSchema === undefined && userInput)
        ? { skipPageSchemaValidation: true }
        : {}),
    };
  });
};

const toFlowTestCases = (
  prefix: string,
  testCases: TestCases<FluggastrechteUserData>,
): FlowTestCases<FluggastrechteUserData> =>
  Object.fromEntries(
    testCases.map((testCase, index) => {
      const destination = testCase[1].at(-1)?.split("/").at(-1) ?? "unknown";
      return [
        `${prefix}-${destination}-${index + 1}`,
        toExpectedSteps(testCase),
      ];
    }),
  );

export const fluggastrechteFormularTestCases = {
  xstateConfig: fluggastrechtFlow.config,
  newEngineConfig: fluggastrechteFormularFlowConfig,
  testcases: {
    weiterePersonHinzufuegen: [
      {
        stepId: "/persoenliche-daten/weitere-personen/uebersicht",
        userInput: reachPartialFlowInput({
          isWeiterePersonen: "yes",
          weiterePersonen: [],
        }),
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
    ...toFlowTestCases(
      "annullierung-ersatzflug-nein",
      testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugNo,
    ),
    ...toFlowTestCases(
      "annullierung-ersatzflug-ja",
      testCasesFluggastrechteFormularFlugdatenAnnullierungWithErsatzflugYes,
    ),
    ...toFlowTestCases(
      "fluggesellschaft-adresse",
      testCasesFluggastrechteFormularFlugdatenFluggesellschaftAddresse,
    ),
    ...toFlowTestCases(
      "nichtbefoerderung",
      testCasesFluggastrechteFormularFlugdatenNichtBefoerderung,
    ),
    ...toFlowTestCases(
      "verspaetung",
      testCasesFluggastrechteFormularFlugdatenVerspaetet,
    ),
    ...toFlowTestCases(
      "grundvoraussetzungen",
      testCasesFluggastrechteFormularGrundvoraussetzungen,
    ),
    ...toFlowTestCases(
      "persoenliche-daten",
      testCasesFluggastrechteFormularPersoenlicheDaten,
    ),
    ...toFlowTestCases(
      "prozessfuehrung",
      testCasesFluggastrechteFormularProzessfuehrung,
    ),
    ...toFlowTestCases(
      "streitwert-kosten",
      testCasesFluggastrechteFormularStreitwertKosten,
    ),
  },
} satisfies FlowTestConfig<FluggastrechteUserData, PageConfigMap>;
