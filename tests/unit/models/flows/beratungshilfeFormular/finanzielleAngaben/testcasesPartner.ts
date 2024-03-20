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
    { zusammenleben: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/partner/zusammenleben`,
      `${FINANZIELLE_ANGABEN}/partner/partner-einkommen`,
    ],
  ],
  [
    { zusammenleben: "no" },
    [
      `${FINANZIELLE_ANGABEN}/partner/zusammenleben`,
      `${FINANZIELLE_ANGABEN}/partner/unterhalt`,
    ],
  ],
  [
    { partnerEinkommen: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/partner/partner-einkommen`,
      `${FINANZIELLE_ANGABEN}/partner/partner-einkommen-summe`,
    ],
  ],
  [
    { partnerEinkommen: "no" },
    [
      `${FINANZIELLE_ANGABEN}/partner/partner-einkommen`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
    ],
  ],
  [
    { unterhalt: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/partner/unterhalt`,
      `${FINANZIELLE_ANGABEN}/partner/unterhalts-summe`,
    ],
  ],
  [
    { unterhalt: "no" },
    [
      `${FINANZIELLE_ANGABEN}/partner/unterhalt`,
      `${FINANZIELLE_ANGABEN}/partner/keine-rolle`,
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
