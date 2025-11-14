import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";

export const testCasesPKHFormularFinanzielleAngabenAusgaben = {
  ausgabenNo: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
      userInput: {
        hasAusgaben: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/besondere-belastungen",
    },
  ],
  addVersicherungen: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
      userInput: {
        hasAusgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/zusammenfassung",
      addArrayItemEvent: "add-versicherungen",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen/0/daten",
      userInput: {
        "versicherungen#art": "sonstige",
        "versicherungen#beitrag": "10",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen/0/sonstige-art",
      userInput: {
        "versicherungen#sonstigeArt": "sonstige",
      },
    },
    { stepId: "/finanzielle-angaben/ausgaben/zusammenfassung" },
  ],
  addRatenzahlungen: [
    {
      stepId: "/finanzielle-angaben/ausgaben/zusammenfassung",
      addArrayItemEvent: "add-ratenzahlungen",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/0/daten",
      userInput: {
        "ratenzahlungen#art": "art",
        "ratenzahlungen#zahlungsempfaenger": "empfaenger",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/ratenzahlungen/0/zahlungspflichtiger",
      userInput: { "ratenzahlungen#zahlungspflichtiger": "myself" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/0/betragGesamt",
      userInput: { "ratenzahlungen#betragGesamt": "10" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/0/restschuld",
      userInput: { "ratenzahlungen#restschuld": "10" },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/0/laufzeitende",
      userInput: { "ratenzahlungen#laufzeitende": "01.01.2026" },
    },
    // { stepId: "/finanzielle-angaben/ausgaben/zusammenfassung" },
  ],
  addRatenzahlungenSplit: [
    {
      stepId: "/finanzielle-angaben/ausgaben/zusammenfassung",
      addArrayItemEvent: "add-ratenzahlungen",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen/0/daten",
      userInput: {
        "ratenzahlungen#art": "art",
        "ratenzahlungen#zahlungsempfaenger": "empfaenger",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/ratenzahlungen/0/zahlungspflichtiger",
      userInput: {
        "ratenzahlungen#zahlungspflichtiger": "myselfAndSomeoneElse",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/ratenzahlungen/0/betragGemeinsamerAnteil",
      userInput: { "ratenzahlungen#betragGesamt": "100" },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/ratenzahlungen/0/betragEigenerAnteil",
      userInput: { "ratenzahlungen#betragEigenerAnteil": "50" },
    },
  ],
  addSonstigeAusgaben: [
    {
      stepId: "/finanzielle-angaben/ausgaben/zusammenfassung",
      addArrayItemEvent: "add-sonstigeAusgaben",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/daten",
      userInput: {
        "sonstigeAusgaben#art": "art",
        "sonstigeAusgaben#zahlungsempfaenger": "empfaenger",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/zahlungspflichtiger",
      userInput: {
        "sonstigeAusgaben#zahlungspflichtiger": "myself",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/betragGesamt",
      userInput: {
        "sonstigeAusgaben#betragGesamt": "10",
      },
    },
    { stepId: "/finanzielle-angaben/ausgaben/zusammenfassung" },
  ],
  addSonstigeAusgabenPartner: [
    {
      stepId: "/finanzielle-angaben/ausgaben/zusammenfassung",
      addArrayItemEvent: "add-sonstigeAusgaben",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/daten",
      userInput: {
        "sonstigeAusgaben#art": "art",
        "sonstigeAusgaben#zahlungsempfaenger": "empfaenger",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/zahlungspflichtiger",
      userInput: {
        "sonstigeAusgaben#zahlungspflichtiger": "myselfAndPartner",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/betragGemeinsamerAnteil",
      userInput: {
        "sonstigeAusgaben#betragGesamt": "10",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/ausgaben/sonstigeAusgaben/0/betragEigenerAnteil",
      userInput: {
        "sonstigeAusgaben#betragEigenerAnteil": "10",
      },
    },
    { stepId: "/finanzielle-angaben/ausgaben/zusammenfassung" },
  ],
  besondereBelastungen: [
    {
      stepId: "/finanzielle-angaben/ausgaben/besondere-belastungen",
      userInput: {
        besondereBelastungen: {
          pregnancy: "off",
          singleParent: "off",
          disability: "off",
          medicalReasons: "off",
          none: "on",
        },
      },
    },
    {
      stepId: "/gesetzliche-vertretung/frage",
    },
  ],
} satisfies FlowTestCases<
  UserDataFromPagesSchema<typeof pkhFormularFinanzielleAngabenAusgabenPages>
>;
