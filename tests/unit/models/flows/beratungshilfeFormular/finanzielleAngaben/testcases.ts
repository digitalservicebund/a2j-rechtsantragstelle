import { createMachine } from "xstate";
import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import type { TestCases } from "../../TestCases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const machine: FlowStateMachine = createMachine(beratungshilfeFormular.config, {
  guards: beratungshilfeFormular.guards,
});

const FINANZIELLE_ANGABEN = "finanzielleAngaben";

const cases = [
  [
    { staatlicheLeistungen: "buergergeld" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/staatliche-leistungen`,
      `${FINANZIELLE_ANGABEN}/besitz/eigentum-info`,
    ],
  ],
  [
    { staatlicheLeistungen: "asylbewerberleistungen" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/staatliche-leistungen`,
      `${FINANZIELLE_ANGABEN}/danke`,
    ],
  ],
  [
    { staatlicheLeistungen: "grundsicherung" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/staatliche-leistungen`,
      `${FINANZIELLE_ANGABEN}/danke`,
    ],
  ],
  [
    { staatlicheLeistungen: "keine" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/staatliche-leistungen`,
      `${FINANZIELLE_ANGABEN}/einkommen/erwerbstaetig`,
    ],
  ],
  [
    { erwerbstaetig: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/erwerbstaetig`,
      `${FINANZIELLE_ANGABEN}/einkommen/art`,
    ],
  ],
  [
    { erwerbstaetig: "no" },
    [
      `${FINANZIELLE_ANGABEN}/einkommen/erwerbstaetig`,
      `${FINANZIELLE_ANGABEN}/einkommen/situation`,
    ],
  ],
  [
    { partnerschaft: "no" },
    [
      `${FINANZIELLE_ANGABEN}/partner/partnerschaft`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
    ],
  ],
  [
    { partnerschaft: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/partner/partnerschaft`,
      `${FINANZIELLE_ANGABEN}/partner/zusammenleben`,
    ],
  ],
  [
    { hasKinder: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
      `${FINANZIELLE_ANGABEN}/kinder/uebersicht`,
    ],
  ],
  [
    { hasKinder: "no" },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/eigentum-info`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/bankkonten-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/geldanlagen-frage`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/geldanlagen-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/wertsachen-frage`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/wertsachen-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/grundeigentum-frage`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/grundeigentum-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/kraftfahrzeuge-frage`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/kraftfahrzeuge-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/gesamtwert`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/gesamtwert`,
      `${FINANZIELLE_ANGABEN}/besitzZusammenfassung/zusammenfassung`,
    ],
  ],
  [
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitzZusammenfassung/zusammenfassung`,
      `${FINANZIELLE_ANGABEN}/danke`,
    ],
  ],
  [{}, [`${FINANZIELLE_ANGABEN}/danke`, "persoenlicheDaten/start"]],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngaben = {
  machine,
  cases,
};
