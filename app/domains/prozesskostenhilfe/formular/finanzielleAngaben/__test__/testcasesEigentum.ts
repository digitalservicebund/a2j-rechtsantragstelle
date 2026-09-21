import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFormularUserData } from "../../userData";
import { finanzielleAngabenTestcaseData } from "./testcasesData";

export const testCasesPKHFormularFinanzielleAngabenEigentum = {
  rentsApartment: [
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        utilitiesCost: "500",
        heatingCosts: "500",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
    },
  ],
  partnerschaftYes: [
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",
      skipPageSchemaValidation: true,
      userInput: { ...finanzielleAngabenTestcaseData },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/heirat-info",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
    },
  ],
  noEigentum: [
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasBankkonto: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasGeldanlage: "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasKraftfahrzeug: "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasWertsache: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasGrundeigentum: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
    },
  ],
  bankkonten: [
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "bankkonten#kontoEigentuemer": "myself",
        "bankkonten#bankName": "N26",
        "bankkonten#kontostand": "1000000",
        "bankkonten#iban": "",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
    },
  ],
  bankkontenWarnung: [
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasBankkonto: "yes",
      },
    },
    { stepId: "/finanzielle-angaben/eigentum/bankkonten/warnung" },
  ],
  geldanlagenBargeld: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenWertpapiere: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenGuthabenKrypto: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenGiroTagesgeldSparkonto: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
        "geldanlagen#kontoBankName": "N26",
        "geldanlagen#kontoIban": "DE34500105179381718236",
        "geldanlagen#kontoBezeichnung": "Persönlich",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenBefristet: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
        "geldanlagen#befristetArt": "lifeInsurance",
        "geldanlagen#verwendungszweck": "Zweck",
        "geldanlagen#auszahlungdatum": "01.01.2035",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenForderung: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
        "geldanlagen#forderung": "Forderung String",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenSonstiges: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "geldanlagen#wert": "1000",
        "geldanlagen#verwendungszweck": "Zweck",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
    },
  ],
  geldanlagenWarnung: [
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasGeldanlage: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen/warnung",
    },
  ],
  wertgegenstand: [
    {
      stepId:
        "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "wertsachen#eigentuemer": "myself",
        "wertsachen#art": "Kandelaber",
        "wertsachen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
    },
  ],
  wertgegenstandWarnung: [
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasWertsache: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende/warnung",
    },
  ],
  kraftfahrzeugOver10000: [
    {
      stepId:
        "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "kraftfahrzeuge#hasArbeitsweg": "no",
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
        "kraftfahrzeuge#marke": "Audi",
        "kraftfahrzeuge#eigentuemer": "myself",
        "kraftfahrzeuge#verkaufswert": "100000",
        "kraftfahrzeuge#kilometerstand": 1000,
        "kraftfahrzeuge#anschaffungsjahr": "2023",
        "kraftfahrzeuge#baujahr": "1995",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
    },
  ],
  kraftfahrzeugWarnung: [
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasKraftfahrzeug: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge/warnung",
    },
  ],
  bewohntGrundeigentum: [
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "grundeigentum#verkaufswert": "500000",
        "grundeigentum#flaeche": "75",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    },
  ],
  grundeigentumNotBewohnt: [
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      userInput: {
        ...finanzielleAngabenTestcaseData,
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
        "grundeigentum#flaeche": "75",
        "grundeigentum#verkaufswert": "500000",
        "grundeigentum#strassehausnummer": "Musterstrasse 1",
        "grundeigentum#plz": "12345",
        "grundeigentum#ort": "Musterstadt",
        "grundeigentum#land": "DE",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
    },
  ],
  grundeigentumWarnung: [
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/uebersicht",
      skipPageSchemaValidation: true,
      userInput: {
        ...finanzielleAngabenTestcaseData,
        hasGrundeigentum: "yes",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum/warnung",
    },
  ],
} satisfies FlowTestCases<ProzesskostenhilfeFormularUserData>;
