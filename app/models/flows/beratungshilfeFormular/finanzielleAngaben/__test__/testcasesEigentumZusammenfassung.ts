/* eslint-disable @typescript-eslint/ban-ts-comment */
import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeArbeitsweg =
  "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg";
const finanzielleAngabenEigentumZusammenfassungKraftfahrzeugeWert =
  "finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge/wert";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumBewohntFrage =
  "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage";
const finanzielleAngabenEigentumZusammenfassungGrundeigentumDaten =
  "finanzielle-angaben/eigentum-zusammenfassung/grundeigentum/daten";
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
      // @ts-ignore
      grundeigentum: [{ isBewohnt: "no" }],
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
      // @ts-ignore
      grundeigentum: [{ isBewohnt: "family" }],
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
      // @ts-ignore
      grundeigentum: [{ isBewohnt: "yes" }],
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
      // @ts-ignore
      grundeigentum: [{ isBewohnt: "no" }, { isBewohnt: "yes" }],
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
