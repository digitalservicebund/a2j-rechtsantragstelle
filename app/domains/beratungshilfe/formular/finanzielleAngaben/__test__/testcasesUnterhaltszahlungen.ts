import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachUnterhaltszahlungen } from "~/domains/beratungshilfe/formular/__test__/reachData";

export const testCasesBeratungshilfeFormularFinanzielleAngabenUnterhaltszahlungen =
  {
    noWeitereUnterhaltszahlungen: [
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
        userInput: {
          ...reachUnterhaltszahlungen,
          hasWeitereUnterhaltszahlungen: "no",
        },
      },
      {
        stepId: "/finanzielle-angaben/wohnung/wohnsituation",
      },
    ],
    weitereUnterhaltszahlungenUebersichtTransition: [
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
        skipPageSchemaValidation: true,
        userInput: {
          ...reachUnterhaltszahlungen,
          hasWeitereUnterhaltszahlungen: "yes",
          unterhaltszahlungen: [
            {
              firstName: "a",
              surname: "b",
              familyRelationship: "kid",
              birthday: "10.10.2010",
              monthlyPayment: "10",
            },
          ],
        },
      },
      {
        stepId: "/finanzielle-angaben/wohnung/wohnsituation",
      },
    ],
    unterhaltszahlungenNotEntered: [
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
        skipPageSchemaValidation: true,
        userInput: {
          ...reachUnterhaltszahlungen,
          hasWeitereUnterhaltszahlungen: "yes",
        },
      },
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/warnung",
      },
    ],
    personOnlyOnePageInFlow: [
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
        addArrayItemEvent: "add-unterhaltszahlungen",
        userInput: {
          ...reachUnterhaltszahlungen,
          hasWeitereUnterhaltszahlungen: "yes",
        },
      },
      {
        stepId:
          "/finanzielle-angaben/andere-unterhaltszahlungen/person/0/daten",
        userInput: {
          "unterhaltszahlungen#familyRelationship": "mother",
          "unterhaltszahlungen#firstName": "a",
          "unterhaltszahlungen#surname": "b",
          "unterhaltszahlungen#birthday": "01.01.2020",
          "unterhaltszahlungen#monthlyPayment": "100",
        },
      },
      {
        stepId: "/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      },
    ],
  } satisfies FlowTestCases<BeratungshilfeFormularUserData>;
