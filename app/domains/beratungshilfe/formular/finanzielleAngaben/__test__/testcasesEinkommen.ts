import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenStart = "/finanzielle-angaben/einkommen/start";
const finanzielleAngabenEinkommenStaatlicheLeistungen =
  "/finanzielle-angaben/einkommen/staatliche-leistungen";
const persoenlicheDatenStart = "/persoenliche-daten/start";

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = [
  [
    {},
    [
      "/rechtsproblem/situation-beschreibung",
      finanzielleAngabenStart,
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      persoenlicheDatenStart,
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
    },
    [
      finanzielleAngabenStart,
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      persoenlicheDatenStart,
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
      hasBankkonto: "no",
      hasWertsache: "no",
      hasGeldanlage: "no",
      hasGrundeigentum: "no",
      hasKraftfahrzeug: "no",
    },
    [
      finanzielleAngabenStart,
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "/finanzielle-angaben/eigentum/eigentum-info",
      "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
      "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
      "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
      "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
      "/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      persoenlicheDatenStart,
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [finanzielleAngabenEinkommenStaatlicheLeistungen, persoenlicheDatenStart],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [finanzielleAngabenEinkommenStaatlicheLeistungen, persoenlicheDatenStart],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "yes" },
    [
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "/finanzielle-angaben/einkommen/erwerbstaetig",
      "/finanzielle-angaben/einkommen/art",
      "/finanzielle-angaben/einkommen/situation",
      "/finanzielle-angaben/einkommen/weiteres-einkommen",
      "/finanzielle-angaben/einkommen/einkommen",
      "/finanzielle-angaben/partner/partnerschaft",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "no" },
    [
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "/finanzielle-angaben/einkommen/erwerbstaetig",
      "/finanzielle-angaben/einkommen/situation",
      "/finanzielle-angaben/einkommen/weiteres-einkommen",
      "/finanzielle-angaben/einkommen/einkommen",
      "/finanzielle-angaben/partner/partnerschaft",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;
