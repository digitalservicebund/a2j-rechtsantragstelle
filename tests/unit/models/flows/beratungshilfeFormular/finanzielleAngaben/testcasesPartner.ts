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
    { partnerschaft: "no" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { partnerschaft: "yes" },
    [
      "finanzielleAngaben/partner/partnerschaft",
      "finanzielleAngaben/partner/zusammenleben",
    ],
  ],
  [
    { zusammenleben: "yes" },
    [
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/partner-einkommen",
    ],
  ],
  [
    { zusammenleben: "no" },
    [
      "finanzielleAngaben/partner/zusammenleben",
      "finanzielleAngaben/partner/unterhalt",
    ],
  ],
  [
    { partnerEinkommen: "yes" },
    [
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/partner/partner-einkommen-summe",
    ],
  ],
  [
    { partnerEinkommen: "no" },
    [
      "finanzielleAngaben/partner/partner-einkommen",
      "finanzielleAngaben/kinder/kinder-frage",
    ],
  ],
  [
    { unterhalt: "yes" },
    [
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/unterhalts-summe",
    ],
  ],
  [
    { unterhalt: "no" },
    [
      "finanzielleAngaben/partner/unterhalt",
      "finanzielleAngaben/partner/keine-rolle",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenPartner = {
  machine,
  cases,
};
