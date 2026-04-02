import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";
import { addYears, today, toGermanDateString } from "~/util/date";

export const testCasesPKHFormularFinanzielleAngabenAusgaben = {
  ausgabenYes: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
      userInput: {
        hasAusgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-frage",
    },
  ],
  versicherungenNo: [
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-frage",
      userInput: {
        hasVersicherungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-frage",
    },
  ],
  addVersicherungen: [
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-frage",
      userInput: {
        hasVersicherungen: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-uebersicht",
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
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-uebersicht",
    },
  ],
  ratenzahlungenNo: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-frage",
      userInput: {
        hasRatenzahlungen: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-frage",
    },
  ],
  addRatenzahlungen: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-frage",
      userInput: {
        hasRatenzahlungen: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-uebersicht",
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
      userInput: {
        "ratenzahlungen#laufzeitende": toGermanDateString(addYears(today(), 1)),
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-uebersicht",
    },
  ],
  addRatenzahlungenSplit: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-uebersicht",
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
  sonstigeAusgabenNo: [
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-frage",
      userInput: {
        hasAusgaben: "yes",
        hasSonstigeAusgaben: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/besondere-belastungen",
    },
  ],
  addSonstigeAusgaben: [
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-frage",
      userInput: {
        hasSonstigeAusgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
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
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
    },
  ],
  addSonstigeAusgabenPartner: [
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
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
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
    },
  ],
  versicherungenWarnung: [
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        hasVersicherungen: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/versicherungen-warnung",
    },
  ],
  ratenzahlungenWarnung: [
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        hasRatenzahlungen: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ratenzahlungen-warnung",
    },
  ],
  sonstigeAusgabenWarnung: [
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        hasSonstigeAusgaben: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/sonstige-ausgaben-warnung",
    },
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
