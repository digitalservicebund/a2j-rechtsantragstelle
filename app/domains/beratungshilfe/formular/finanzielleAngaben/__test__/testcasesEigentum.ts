import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFinanzielleAngabenEigentumUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/eigentum/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/partner/userData";

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
  hasWertsache: [
    {
      stepId: finanzielleAngabenEigentumWertgegenstaendeFrage,
      userInput: {
        hasWertsache: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
      addArrayItemEvent: "add-wertsachen",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/0/daten",
      userInput: {
        "wertsachen#art": "Kandelabra",
        "wertsachen#eigentuemer": "myself",
        "wertsachen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
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
  hasGrundeigentumBewohnt: [
    {
      stepId: finanzielleAngabenEigentumGrundeigentumFrage,
      userInput: {
        hasGrundeigentum: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
      addArrayItemEvent: "add-grundeigentum",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum/0/bewohnt-frage",
      userInput: {
        "grundeigentum#isBewohnt": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum/0/bewohnt-daten",
      userInput: {
        "grundeigentum#art": "eigentumswohnung",
        "grundeigentum#eigentuemer": "myself",
        "grundeigentum#flaeche": "100",
        "grundeigentum#verkaufswert": "100000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    },
  ],
  hasGrundeigentumNotBewohnt: [
    {
      stepId: finanzielleAngabenEigentumGrundeigentumFrage,
      userInput: {
        hasGrundeigentum: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
      addArrayItemEvent: "add-grundeigentum",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum/0/bewohnt-frage",
      userInput: {
        "grundeigentum#isBewohnt": "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum/0/daten",
      userInput: {
        "grundeigentum#art": "eigentumswohnung",
        "grundeigentum#eigentuemer": "myself",
        "grundeigentum#flaeche": "100",
        "grundeigentum#verkaufswert": "100000",
        "grundeigentum#strassehausnummer": "123 Electric Ave",
        "grundeigentum#plz": "12437",
        "grundeigentum#ort": "Berlin",
        "grundeigentum#land": "Berlin",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
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
  hasKraftfahrzeugWithArbeitsweg: [
    {
      stepId: finanzielleAngabenEigentumKraftfahrzeugeFrage,
      userInput: {
        hasKraftfahrzeug: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
      addArrayItemEvent: "add-kraftfahrzeuge",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/0/arbeitsweg",
      userInput: {
        "kraftfahrzeuge#hasArbeitsweg": "yes",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/0/wert",
      userInput: {
        "kraftfahrzeuge#wert": "over10000",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeug/0/fahrzeuge",
      userInput: {
        "kraftfahrzeuge#art": "auto",
        "kraftfahrzeuge#marke": "BMW",
        "kraftfahrzeuge#eigentuemer": "myself",
        "kraftfahrzeuge#kilometerstand": 100000,
        "kraftfahrzeuge#anschaffungsjahr": "2000",
        "kraftfahrzeuge#baujahr": "1987",
        "kraftfahrzeuge#verkaufswert": "12000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
    },
  ],
  hasGeldanlageBargeld: [
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
  hasGeldanlageWertpapiere: [
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
        "geldanlagen#art": "wertpapiere",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/wertpapiere",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  hasGeldanlageGuthabenkonto: [
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
        "geldanlagen#art": "guthabenkontoKrypto",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/guthabenkonto-krypto",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  hasGeldanlageGirokonto: [
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
        "geldanlagen#art": "giroTagesgeldSparkonto",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/giro-tagesgeld-sparkonto",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
        "geldanlagen#kontoBankName": "N26 Bank",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  hasGeldanlageBefristet: [
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
        "geldanlagen#art": "befristet",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/befristet",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
        "geldanlagen#befristetArt": "lifeInsurance",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  hasGeldanlageForderung: [
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
        "geldanlagen#art": "forderung",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/forderung",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  hasGeldanlageSonstiges: [
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
        "geldanlagen#art": "sonstiges",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/0/sonstiges",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "100",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
} satisfies FlowTestCases<
  BeratungshilfeFinanzielleAngabenEigentumUserData &
    BeratungshilfeFinanzielleAngabenPartnerUserData
>;
