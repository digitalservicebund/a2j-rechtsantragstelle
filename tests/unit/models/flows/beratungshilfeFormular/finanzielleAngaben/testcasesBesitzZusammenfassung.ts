import { machine } from "./testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
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
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenBesitzZusammenfassung =
  {
    machine,
    cases,
  };
