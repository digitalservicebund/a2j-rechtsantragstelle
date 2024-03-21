import { machine } from "./testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { staatlicheLeistungen: "buergergeld" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/besitz/eigentum-info",
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
    { staatlicheLeistungen: "keine" },
    [
      "finanzielleAngaben/einkommen/staatliche-leistungen",
      "finanzielleAngaben/einkommen/erwerbstaetig",
    ],
  ],
  [
    { erwerbstaetig: "yes" },
    [
      "finanzielleAngaben/einkommen/erwerbstaetig",
      "finanzielleAngaben/einkommen/art",
    ],
  ],
  [
    { erwerbstaetig: "no" },
    [
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
