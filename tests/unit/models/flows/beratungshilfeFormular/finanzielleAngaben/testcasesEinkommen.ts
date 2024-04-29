import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "rechtsproblem/situation-beschreibung",
      "finanzielleAngaben/start",
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "persoenlicheDaten/start",
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
    },
    [
      "finanzielleAngaben/start",
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/eigentum/eigentum-info",
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "persoenlicheDaten/start",
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
      "finanzielleAngaben/start",
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/eigentum/eigentum-info",
      "finanzielleAngaben/eigentum/bankkonten-frage",
      "finanzielleAngaben/eigentum/geldanlagen-frage",
      "finanzielleAngaben/eigentum/wertgegenstaende-frage",
      "finanzielleAngaben/eigentum/grundeigentum-frage",
      "finanzielleAngaben/eigentum/kraftfahrzeuge-frage",
      "finanzielleAngaben/eigentum-zusammenfassung/zusammenfassung",
      "persoenlicheDaten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "persoenlicheDaten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "persoenlicheDaten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "yes" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/art",
      "finanzielleAngaben/einkommen/situation",
      "finanzielleAngaben/einkommen/weiteres-einkommen",
      "finanzielleAngaben/einkommen/einkommen",
      // TODO why do we only show the partner flow if einkommen is done? The back-flow does not match that requirement.
      // "persoenlicheDaten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "no" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/situation",
      "finanzielleAngaben/einkommen/weiteres-einkommen",
      "finanzielleAngaben/einkommen/einkommen",
      // TODO why do we only show the partner flow if einkommen is done? The back-flow does not match that requirement.
      // "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  machine,
  cases,
};
