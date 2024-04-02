import { machine } from "../testMachine";
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
      besitzTotalWorth: "more10000",
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
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  machine,
  cases,
};
