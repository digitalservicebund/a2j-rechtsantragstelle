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
    {},
    [
      `${FINANZIELLE_ANGABEN}/besitz/bankkonten-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/geldanlagen-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/wertsachen-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/grundeigentum-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/kraftfahrzeuge-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/gesamtwert`,
      `${FINANZIELLE_ANGABEN}/besitzZusammenfassung/zusammenfassung`,
      `${FINANZIELLE_ANGABEN}/danke`,
      "persoenlicheDaten/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenBesitz = {
  machine,
  cases,
};
