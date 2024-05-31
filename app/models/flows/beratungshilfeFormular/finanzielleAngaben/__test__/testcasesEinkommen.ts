import type { TestCases } from "~/models/flows/__test__/TestCases";
import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const finanzielleAngabenStart = "finanzielle-angaben/start";
const finanzielleAngabenEinkommenStaatlicheLeistungen =
  "finanzielle-angaben/einkommen/staatliche-leistungen";
const persoenlicheDatenStart = "persoenliche-daten/start";
const cases = [
  [
    {},
    [
      "rechtsproblem/situation-beschreibung",
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
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
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
      eigentumTotalWorth: "more10000",
    },
    [
      finanzielleAngabenStart,
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
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
      "finanzielle-angaben/einkommen/erwerbstaetig",
      "finanzielle-angaben/einkommen/art",
      "finanzielle-angaben/einkommen/situation",
      "finanzielle-angaben/einkommen/weiteres-einkommen",
      "finanzielle-angaben/einkommen/einkommen",
      // TODO why do we only show the partner flow if einkommen is done? The back-flow does not match that requirement.
      // "persoenliche-daten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "no" },
    [
      finanzielleAngabenEinkommenStaatlicheLeistungen,
      "finanzielle-angaben/einkommen/erwerbstaetig",
      "finanzielle-angaben/einkommen/situation",
      "finanzielle-angaben/einkommen/weiteres-einkommen",
      "finanzielle-angaben/einkommen/einkommen",
      // TODO why do we only show the partner flow if einkommen is done? The back-flow does not match that requirement.
      // "persoenliche-daten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  machine,
  cases,
};
