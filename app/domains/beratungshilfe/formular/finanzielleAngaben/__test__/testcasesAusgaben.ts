import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenAusgabenAusgabenFrage =
  "/finanzielle-angaben/ausgaben/ausgaben-frage";
const persoenlicheDatenStart = "/persoenliche-daten/start";
export const testCasesBeratungshilfeFormularFinanzielleAngabenAusgabe = [
  [
    {
      staatlicheLeistungen: "keine",
    },
    [finanzielleAngabenAusgabenAusgabenFrage, persoenlicheDatenStart],
  ],
  [
    { hasAusgaben: "no", staatlicheLeistungen: "keine" },
    [finanzielleAngabenAusgabenAusgabenFrage, persoenlicheDatenStart],
  ],
  [
    { hasAusgaben: "yes" },
    [
      finanzielleAngabenAusgabenAusgabenFrage,
      "/finanzielle-angaben/ausgaben/situation",
      "/finanzielle-angaben/ausgaben/uebersicht",
      "/finanzielle-angaben/ausgaben/warnung",
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
      "/finanzielle-angaben/ausgaben/situation",
      "/finanzielle-angaben/ausgaben/uebersicht",
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
