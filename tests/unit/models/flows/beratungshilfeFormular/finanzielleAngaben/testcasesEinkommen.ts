import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    {},
    [
      "rechtsproblem/situation-beschreibung",
      "finanzielle-angaben/start",
      "finanzielle-angaben/einkommen/staatliche-leistungen",
      "persoenliche-daten/start",
    ],
  ],
  [
    {
      staatlicheLeistungen: "buergergeld",
    },
    [
      "finanzielle-angaben/start",
      "finanzielle-angaben/einkommen/staatliche-leistungen",
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "persoenliche-daten/start",
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
      "finanzielle-angaben/start",
      "finanzielle-angaben/einkommen/staatliche-leistungen",
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "persoenliche-daten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [
      "finanzielle-angaben/einkommen/staatliche-leistungen",
      "persoenliche-daten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [
      "finanzielle-angaben/einkommen/staatliche-leistungen",
      "persoenliche-daten/start",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "yes" },
    [
      "finanzielle-angaben/einkommen/staatliche-leistungen",
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
      "finanzielle-angaben/einkommen/staatliche-leistungen",
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
