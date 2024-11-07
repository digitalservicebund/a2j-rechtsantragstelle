import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/domains/beratungshilfe/formular/finanzielleAngaben/context";
const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg =
  "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg";
const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert =
  "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/wert";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage =
  "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten =
  "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/daten";

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
          bemerkung: "baujahr",
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
          bemerkung: "baujahr",
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
      "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
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
          bemerkung: "baujahr",
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
      "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
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
      "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
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
      "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung =
  {
    machine,
    cases,
  };
