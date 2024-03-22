import { machine } from "./testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
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
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/besitz/eigentum-info",
      "finanzielleAngaben/besitz/bankkonten-frage",
      "finanzielleAngaben/besitz/geldanlagen-frage",
      "finanzielleAngaben/besitz/wertgegenstaende-frage",
      "finanzielleAngaben/besitz/grundeigentum-frage",
      "finanzielleAngaben/besitz/kraftfahrzeuge-frage",
      "finanzielleAngaben/besitz/gesamtwert",
      "finanzielleAngaben/besitzZusammenfassung/zusammenfassung",
      "finanzielleAngaben/danke",
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/danke",
    ],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/danke",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "yes" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/art",
    ],
  ],
  [
    { staatlicheLeistungen: "keine", erwerbstaetig: "no" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/situation",
    ],
  ],
  [{}, ["finanzielleAngaben/danke", "persoenlicheDaten/start"]],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  machine,
  cases,
};
