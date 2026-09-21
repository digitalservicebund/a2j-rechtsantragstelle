import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFormularUserData } from "../../../userData";
import { finanzielleAngabenTestcaseData } from "../../__test__/testcasesData";

export const testCasesPKHFormularFinanzielleAngabenAbzuege = {
  noArbeitsweg: [
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsweg",
      userInput: { arbeitsweg: "none" },
    },
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    },
  ],
  arbeitswegWalking: [
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsweg",
      userInput: { ...finanzielleAngabenTestcaseData, arbeitsweg: "walking" },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/keine-rolle",
    },
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    },
  ],
  arbeitswegPublicTransport: [
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsweg",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        arbeitsweg: "publicTransport",
      },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/opnv-kosten",
      userInput: { monatlicheOPNVKosten: "100" },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsplatz-entfernung",
      userInput: {
        arbeitsplatz: {
          strasseHausnummer: "Prinzessinnenstraße 8-14",
          plz: "10969",
          ort: "Berlin",
          land: "Deutschland",
        },
        arbeitsplatzEntfernung: 7,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    },
  ],
  arbeitswegPrivateVehicle: [
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsweg",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        arbeitsweg: "privateVehicle",
      },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsplatz-entfernung",
      userInput: {
        arbeitsplatz: {
          strasseHausnummer: "Prinzessinnenstraße 8-14",
          plz: "10969",
          ort: "Berlin",
          land: "Deutschland",
        },
        arbeitsplatzEntfernung: 7,
      },
    },
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
    },
  ],
  arbeitsausgabenUnenteredWarning: [
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasArbeitsausgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsausgaben/warnung",
    },
  ],
  noArbeitsausgaben: [
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        arbeitsweg: "walking",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
    },
  ],
  addArbeitsausgabe: [
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgaben-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        arbeitsweg: "walking",
        hasArbeitsausgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
      addArrayItemEvent: "add-arbeitsausgaben",
    },
    {
      stepId:
        "/finanzielle-angaben/abzuege/arbeitsausgaben/arbeitsausgabe/0/daten",
      userInput: {
        "arbeitsausgaben#beschreibung": "Arbeitsausgabe Beschreibung",
        "arbeitsausgaben#zahlungsfrequenz": "monthly",
        "arbeitsausgaben#betrag": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        arbeitsausgaben: [
          {
            beschreibung: "Arbeitsausgabe Beschreibung",
            zahlungsfrequenz: "monthly",
            betrag: "100",
          },
        ],
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
