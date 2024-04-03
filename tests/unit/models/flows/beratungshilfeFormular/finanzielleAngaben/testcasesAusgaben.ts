import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasAusgaben: "no" },
    ["finanzielleAngaben/ausgaben/ausgaben-frage", "persoenlicheDaten/start"],
  ],
  [
    { hasAusgaben: "yes" },
    [
      "finanzielleAngaben/ausgaben/ausgaben-frage",
      "finanzielleAngaben/ausgaben/situation",
    ],
  ],
  [
    {
      hasAusgaben: "yes",
      ausgaben: [
        {
          art: "kredit",
          zahlungsempfaenger: "nachname",
          beitrag: "",
          hasZahlungsfrist: "no",
          zahlungsfrist: "",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/ausgaben/ausgaben/art",
      "finanzielleAngaben/ausgaben/ausgaben/zahlungsinformation",
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
      "finanzielleAngaben/ausgaben/ausgaben/zahlungsinformation",
      "finanzielleAngaben/ausgaben/ausgaben/laufzeit",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = {
  machine,
  cases,
};
