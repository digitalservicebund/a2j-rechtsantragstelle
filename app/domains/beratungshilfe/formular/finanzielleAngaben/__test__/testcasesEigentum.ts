import type { FlowTestCases } from "~/domains/__test__/TestCases";

const finanzielleAngabenEigentumInfo =
  "/finanzielle-angaben/eigentum/eigentum-info";
const finanzielleAngabenEigentumBankkontenFrage =
  "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage";
const finanzielleAngabenEigentumGeldanlagenFrage =
  "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage";
const finanzielleAngabenEigentumKraftfahrzeugeFrage =
  "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage";
const finanzielleAngabenEigentumWertgegenstaendeFrage =
  "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage";
const finanzielleAngabenEigentumGrundeigentumFrage =
  "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage";
const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentum = {
  noEigentum: [
    {
      stepId: finanzielleAngabenEigentumInfo,
    },
    {
      stepId: finanzielleAngabenEigentumBankkontenFrage,
      userInput: {
        hasBankkonto: "no",
      },
    },
    {
      stepId: finanzielleAngabenEigentumGeldanlagenFrage,
      userInput: {
        hasGeldanlage: "no",
      },
    },
    {
      stepId: finanzielleAngabenEigentumKraftfahrzeugeFrage,
      userInput: {
        hasKraftfahrzeug: "no",
      },
    },
    {
      stepId: finanzielleAngabenEigentumWertgegenstaendeFrage,
      userInput: {
        hasWertsache: "no",
      },
    },
    {
      stepId: finanzielleAngabenEigentumGrundeigentumFrage,
      userInput: {
        hasGrundeigentum: "no",
      },
    },
    {
      stepId: finanzielleAngabenAusgabenAusgabenFrage,
    },
  ],
  eigentumPartnerschaft: [
    {
      stepId: finanzielleAngabenEigentumInfo,
      skipPageSchemaValidation: true,
      userInput: {
        partnerschaft: "yes",
      },
    },
    { stepId: "/finanzielle-angaben/eigentum/heirat-info" },
    { stepId: finanzielleAngabenEigentumBankkontenFrage },
  ],
  hasBankkonto: [
    {
      stepId: finanzielleAngabenEigentumBankkontenFrage,
      userInput: {
        hasBankkonto: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      addArrayItemEvent: "add-bankkonten",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonto/0/daten",
      userInput: {
        "bankkonten#bankName": "Bank1",
        "bankkonten#kontostand": "1000",
        "bankkonten#iban": "DE123456789",
        "bankkonten#kontoEigentuemer": "myself",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
    },
  ],
  bankkontoNotEntered: [
    {
      stepId: finanzielleAngabenEigentumBankkontenFrage,
      userInput: {
        hasBankkonto: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/warnung",
    },
  ],
  geldanlagenNotEntered: [
    {
      stepId: finanzielleAngabenEigentumGeldanlagenFrage,
      userInput: {
        hasGeldanlage: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/warnung",
    },
  ],
  wertsacheNotEntered: [
    {
      stepId: finanzielleAngabenEigentumWertgegenstaendeFrage,
      userInput: {
        hasWertsache: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/warnung",
    },
  ],
  grundeigentumNotEntered: [
    {
      stepId: finanzielleAngabenEigentumGrundeigentumFrage,
      userInput: {
        hasGrundeigentum: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/warnung",
    },
  ],
  kraftfahrzeugNotEntered: [
    {
      stepId: finanzielleAngabenEigentumKraftfahrzeugeFrage,
      userInput: {
        hasKraftfahrzeug: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
    },
  ],
  hasGeldanlage: [
    {
      stepId: finanzielleAngabenEigentumGeldanlagenFrage,
      userInput: {
        hasGeldanlage: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/art",
      userInput: {
        "geldanlagen#art": "bargeld",
        pageData: {
          arrayIndexes: [0],
        },
        geldanlagen: [
          {
            art: "bargeld",
          },
        ],
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/bargeld",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
} satisfies FlowTestCases["testcases"];
