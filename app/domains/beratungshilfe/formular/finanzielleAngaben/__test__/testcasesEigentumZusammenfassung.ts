import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";
const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg =
  "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg";
const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert =
  "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/wert";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage =
  "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten =
  "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/daten";

const defaultInputGrundeigentum = {
  isBewohnt: "family",
  art: "eigentumswohnung",
  eigentuemer: "myself",
  verkaufswert: "",
  flaeche: "",
  strassehausnummer: "",
  ort: "",
  land: "",
} as const;

const cases = [
  [
    // Kraftfahrzeuge
    {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          wert: "under10000",
          hasArbeitsweg: "yes",
          anschaffungsjahr: "anschaffungsjahr",
          art: "art",
          baujahr: "baujahr",
          eigentuemer: "myself",
          kilometerstand: 10,
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg,
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert,
    ],
  ],
  [
    {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          wert: "over10000",
          hasArbeitsweg: "yes",
          anschaffungsjahr: "anschaffungsjahr",
          art: "art",
          baujahr: "baujahr",
          eigentuemer: "myself",
          kilometerstand: 10,
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg,
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert,
      "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
    ],
  ],
  [
    {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          wert: "unsure",
          hasArbeitsweg: "yes",
          anschaffungsjahr: "anschaffungsjahr",
          art: "art",
          baujahr: "baujahr",
          eigentuemer: "myself",
          kilometerstand: 10,
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg,
      finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert,
      "/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
    ],
  ],

  // Grundeigentum
  [
    { hasGrundeigentum: "yes" },
    [
      finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage,
      finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten,
    ],
  ],
  [
    {
      hasGrundeigentum: "yes",
      grundeigentum: [
        {
          ...defaultInputGrundeigentum,
          isBewohnt: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage,
      finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten,
    ],
  ],
  [
    {
      hasGrundeigentum: "yes",
      grundeigentum: [{ ...defaultInputGrundeigentum, isBewohnt: "family" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage,
      finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten,
    ],
  ],
  [
    {
      hasGrundeigentum: "yes",
      grundeigentum: [{ ...defaultInputGrundeigentum, isBewohnt: "yes" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage,
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],
  [
    {
      hasGrundeigentum: "yes",
      grundeigentum: [
        { ...defaultInputGrundeigentum, isBewohnt: "no" },
        { ...defaultInputGrundeigentum, isBewohnt: "yes" },
      ],
      pageData: { arrayIndexes: [1] },
    },
    [
      finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage,
      "/finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],

  // Bankkonten - only one page flow
  [{}, ["/finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten"]],

  // Geldanlagen
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "bargeld" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/bargeld",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "wertpapiere" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/wertpapiere",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "guthabenkontoKrypto" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/guthabenkonto-krypto",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "giroTagesgeldSparkonto" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/giro-tagesgeld-sparkonto",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "befristet" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/befristet",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "forderung" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/forderung",
    ],
  ],
  [
    {
      hasGeldanlage: "yes",
      geldanlagen: [{ art: "sonstiges" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/art",
      "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/sonstiges",
    ],
  ],

  // Wertgegenstände - only one page flow
  [
    {},
    ["/finanzielle-angaben/eigentum-zusammenfassung/wertgegenstaende/daten"],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung =
  {
    machine,
    cases,
  };
