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
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/wert",
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
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/wert",
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/fahrzeuge",
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
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/arbeitsweg",
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/wert",
      "finanzielleAngaben/besitzZusammenfassung/kraftfahrzeuge/fahrzeuge",
    ],
  ],

  // Grundeigentum
  [
    { hasGrundeigentum: "yes" },
    [
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/daten",
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
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-daten",
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
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-frage",
      "finanzielleAngaben/besitzZusammenfassung/grundeigentum/bewohnt-daten",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenBesitzZusammenfassung =
  {
    machine,
    cases,
  };
