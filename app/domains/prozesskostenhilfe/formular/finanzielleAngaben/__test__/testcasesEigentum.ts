import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesPKHFormularFinanzielleAngabenEigentum = {
  rentsApartment: [
    {
      stepId: "/finanzielle-angaben/wohnung/nebenkosten",
      userInput: {
        utilitiesCost: "",
        heatingCosts: "",
        rentsApartment: "yes",
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
      userInput: { partnerschaft: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/heirat-info",
    },
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten-frage",
    },
  ],
  noEigentum: [
    {
      stepId: "/finanzielle-angaben/eigentum/bankkonten-frage",
      userInput: {
        hasBankkonto: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/geldanlagen-frage",
      userInput: {
        hasGeldanlage: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/wertgegenstaende-frage",
      userInput: {
        hasWertsache: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/grundeigentum-frage",
      userInput: {
        hasGrundeigentum: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      userInput: {
        hasKraftfahrzeug: "no",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
    },
  ],
  eigentumZusammenfassungWarning: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      skipPageSchemaValidation: true,
      userInput: { hasBankkonto: "yes" },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/warnung",
    },
    {
      stepId: "/finanzielle-angaben/ausgaben/ausgaben-frage",
    },
  ],
  bankkonten: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-bankkonten",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/bankkonten/0/daten",
      userInput: {
        "bankkonten#kontoEigentuemer": "myself",
        "bankkonten#bankName": "N26",
        "bankkonten#kontostand": "1000000",
        bankkonto: [
          {
            eigentuemer: "myself",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenBargeld: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "bargeld",
        geldanlagen: [
          {
            art: "bargeld",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/bargeld",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenWertpapiere: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "wertpapiere",
        geldanlagen: [
          {
            art: "wertpapiere",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/wertpapiere",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenGuthabenKrypto: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "guthabenkontoKrypto",
        geldanlagen: [
          {
            art: "guthabenkontoKrypto",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/guthabenkonto-krypto",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenGiroTagesgeldSparkonto: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "giroTagesgeldSparkonto",
        geldanlagen: [
          {
            art: "giroTagesgeldSparkonto",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/giro-tagesgeld-sparkonto",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
        "geldanlagen#kontoBankName": "N26",
        "geldanlagen#kontoIban": "DE1234567890",
        "geldanlagen#kontoBezeichnung": "Persönlich",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenBefristet: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "befristet",
        geldanlagen: [
          {
            art: "befristet",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/befristet",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
        "geldanlagen#befristetArt": "lifeInsurance",
        "geldanlagen#verwendungszweck": "Zweck",
        "geldanlagen#auszahlungdatum": "01.01.2035",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenForderung: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "forderung",
        geldanlagen: [
          {
            art: "forderung",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/forderung",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
        "geldanlagen#forderung": "Forderung String",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  geldanlagenSonstiges: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-geldanlagen",
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art",
      userInput: {
        "geldanlagen#art": "sonstiges",
        geldanlagen: [
          {
            art: "sonstiges",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/sonstiges",
      userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
        "geldanlagen#verwendungszweck": "Zweck",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  wertgegenstand: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-wertsachen",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/wertgegenstaende/0/daten",
      userInput: {
        "wertsachen#eigentuemer": "myself",
        "wertsachen#art": "Kandelaber",
        "wertsachen#wert": "1000",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  kraftfahrzeugOver10000: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-kraftfahrzeuge",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/0/arbeitsweg",
      userInput: {
        "kraftfahrzeuge#hasArbeitsweg": "no",
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/0/wert",
      userInput: {
        "kraftfahrzeuge#wert": "over10000",
        kraftfahrzeuge: [
          {
            wert: "over10000",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/0/fahrzeuge",
      userInput: {
        "kraftfahrzeuge#art": "auto",
        "kraftfahrzeuge#marke": "Audi",
        "kraftfahrzeuge#eigentuemer": "myself",
        "kraftfahrzeuge#verkaufswert": "100000",
        "kraftfahrzeuge#kilometerstand": "1000",
        "kraftfahrzeuge#anschaffungsjahr": "2023",
        "kraftfahrzeuge#baujahr": "1995",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  bewohntGrundeigentum: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-grundeigentum",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/bewohnt-frage",
      userInput: {
        "grundeigentum#isBewohnt": "yes",
        grundeigentum: [
          {
            isBewohnt: "yes",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/bewohnt-daten",
      userInput: {
        "grundeigentum#art": "eigentumswohnung",
        "grundeigentum#eigentuemer": "myself",
        "grundeigentum#verkaufswert": "500000",
        "grundeigentum#flaeche": "75",
      },
    },
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
  grundeigentumNotBewohnt: [
    {
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      addArrayItemEvent: "add-grundeigentum",
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/bewohnt-frage",
      userInput: {
        "grundeigentum#isBewohnt": "no",
        grundeigentum: [
          {
            isBewohnt: "no",
          },
        ],
        pageData: { arrayIndexes: [0] },
      },
    },
    {
      stepId:
        "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/0/daten",
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
      stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
    },
  ],
} satisfies FlowTestCases["testcases"];
