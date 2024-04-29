import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

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
          kilometerstand: "10",
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/wert",
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
          kilometerstand: "10",
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/wert",
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
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
          kilometerstand: "10",
          marke: "marke",
          verkaufswert: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/wert",
      "finanzielleAngaben/eigentum-zusammenfassung/kraftfahrzeuge/fahrzeuge",
    ],
  ],

  // Grundeigentum
  [
    { hasGrundeigentum: "yes" },
    [
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
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
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEigentumZusammenfassung =
  {
    machine,
    cases,
  };
