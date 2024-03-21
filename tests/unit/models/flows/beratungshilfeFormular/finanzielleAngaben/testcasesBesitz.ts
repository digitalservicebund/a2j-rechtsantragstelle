import { createMachine } from "xstate";
import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import type { TestCases } from "../../TestCases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const machine: FlowStateMachine = createMachine(beratungshilfeFormular.config, {
  guards: beratungshilfeFormular.guards,
});

const cases = [
  [
    {},
    [
      "finanzielleAngaben/besitz/bankkonten-frage",
      "finanzielleAngaben/besitz/geldanlagen-frage",
      "finanzielleAngaben/besitz/wertsachen-frage",
      "finanzielleAngaben/besitz/grundeigentum-frage",
      "finanzielleAngaben/besitz/kraftfahrzeuge-frage",
      "finanzielleAngaben/besitz/gesamtwert",
      "finanzielleAngaben/besitzZusammenfassung/zusammenfassung",
      "finanzielleAngaben/danke",
      "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenBesitz = {
  machine,
  cases,
};
