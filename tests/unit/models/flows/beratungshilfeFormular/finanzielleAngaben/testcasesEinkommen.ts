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
  [{}, [`${FINANZIELLE_ANGABEN}/danke`, "persoenlicheDaten/start"]],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenEinkommen = {
  machine,
  cases,
};
