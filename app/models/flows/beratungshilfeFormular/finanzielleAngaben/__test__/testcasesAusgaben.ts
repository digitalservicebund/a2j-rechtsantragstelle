import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {
      staatlicheLeistungen: "keine",
    },
    ["finanzielle-angaben/ausgaben/ausgaben-frage", "persoenliche-daten/start"],
  ],
  [
    { hasAusgaben: "no", staatlicheLeistungen: "keine" },
    ["finanzielle-angaben/ausgaben/ausgaben-frage", "persoenliche-daten/start"],
  ],
  [
    { hasAusgaben: "yes" },
    [
      "finanzielle-angaben/ausgaben/ausgaben-frage",
      "finanzielle-angaben/ausgaben/situation",
      "finanzielle-angaben/ausgaben/uebersicht",
      "persoenliche-daten/start",
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
      "finanzielle-angaben/ausgaben/ausgaben/art",
      "finanzielle-angaben/ausgaben/ausgaben/zahlungsinformation",
      "finanzielle-angaben/ausgaben/ausgaben/laufzeit",
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
      "finanzielle-angaben/ausgaben/ausgaben/zahlungsinformation",
      "finanzielle-angaben/ausgaben/ausgaben/laufzeit",
      "finanzielle-angaben/ausgaben/ausgaben/zahlungsfrist",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = {
  machine,
  cases,
};
