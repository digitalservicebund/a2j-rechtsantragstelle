import type { FlowTestCases } from "~/domains/__test__/TestCases";

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
      userInput: { arbeitsweg: "walking" },
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
      userInput: { arbeitsweg: "publicTransport" },
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
        arbeitsplatzEntfernung: "7",
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
      userInput: { arbeitsweg: "privateVehicle" },
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
        arbeitsplatzEntfernung: "7",
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
        hasArbeitsausgaben: "no",
        arbeitsweg: "walking",
        currentlyEmployed: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/partner/partnerschaft",
    },
  ],
  addArbeitsausgabe: [
    {
      stepId: "/finanzielle-angaben/abzuege/arbeitsausgaben/uebersicht",
      addArrayItemEvent: "add-arbeitsausgaben",
      userInput: {
        pageData: {
          arrayIndexes: [0],
        },
        arbeitsausgaben: [],
      },
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
    },
  ],
} satisfies FlowTestCases["testcases"];
