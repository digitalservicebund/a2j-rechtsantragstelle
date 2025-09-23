import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";
const finanzielleAngabenAusgabenSituation =
  "/finanzielle-angaben/ausgaben/situation";
const persoenlicheDatenStart = "/persoenliche-daten/start";
export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = [
  [
    {
      staatlicheLeistungen: "keine",
    },
    [
      finanzielleAngabenAusgabenAusgabenFrage,
      finanzielleAngabenAusgabenSituation,
    ],
  ],
  [
    { hasAusgaben: "no", staatlicheLeistungen: "keine" },
    [
      finanzielleAngabenAusgabenAusgabenFrage,
      finanzielleAngabenAusgabenSituation,
    ],
  ],
  [
    { hasAusgaben: "yes" },
    [
      finanzielleAngabenAusgabenAusgabenFrage,
      "/finanzielle-angaben/ausgaben/uebersicht",
      "/finanzielle-angaben/ausgaben/warnung",
      finanzielleAngabenAusgabenSituation,
    ],
  ],
  [
    {
      hasAusgaben: "yes",
      staatlicheLeistungen: "keine",
      ausgaben: [
        {
          art: "test",
          beitrag: "10",
          hasZahlungsfrist: "no",
          zahlungsempfaenger: "test",
          zahlungsfrist: "123",
        },
      ],
    },
    [
      finanzielleAngabenAusgabenAusgabenFrage,
      "/finanzielle-angaben/ausgaben/uebersicht",
      "/finanzielle-angaben/ausgaben/situation",
      persoenlicheDatenStart,
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
      "/finanzielle-angaben/ausgaben/ausgaben/art",
      "/finanzielle-angaben/ausgaben/ausgaben/zahlungsinformation",
      "/finanzielle-angaben/ausgaben/ausgaben/laufzeit",
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
      "/finanzielle-angaben/ausgaben/ausgaben/zahlungsinformation",
      "/finanzielle-angaben/ausgaben/ausgaben/laufzeit",
      "/finanzielle-angaben/ausgaben/ausgaben/zahlungsfrist",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;
