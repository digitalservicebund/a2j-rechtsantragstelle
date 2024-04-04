import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {
      staatlicheLeistungen: "keine",
    },
    ["finanzielleAngaben/ausgaben/ausgaben-frage", "persoenlicheDaten/start"],
  ],
  [
    { hasAusgaben: "no", staatlicheLeistungen: "keine" },
    ["finanzielleAngaben/ausgaben/ausgaben-frage", "persoenlicheDaten/start"],
  ],
  [
    { hasAusgaben: "yes" },
    [
      "finanzielleAngaben/ausgaben/ausgaben-frage",
      "finanzielleAngaben/ausgaben/situation",
      "finanzielleAngaben/ausgaben/uebersicht",
      "persoenlicheDaten/start",
    ],
  ],
  [
    {
      hasAusgaben: "yes",
      ausgaben: [
        {
          art: "kredit",
          zahlungsempfaenger: "nachname",
          beitrag: "10",
          hasZahlungsfrist: "no",
          zahlungsfrist: "",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/ausgaben/ausgaben/art",
      "finanzielleAngaben/ausgaben/ausgaben/zahlungsinformation",
      "finanzielleAngaben/ausgaben/ausgaben/laufzeit",
    ],
  ],
  [
    {
      hasAusgaben: "yes",
      ausgaben: [
        {
          art: "kredit",
          zahlungsempfaenger: "nachname",
          beitrag: "10",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/ausgaben/ausgaben/zahlungsinformation",
      "finanzielleAngaben/ausgaben/ausgaben/laufzeit",
      "finanzielleAngaben/ausgaben/ausgaben/zahlungsfrist",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = {
  machine,
  cases,
};
