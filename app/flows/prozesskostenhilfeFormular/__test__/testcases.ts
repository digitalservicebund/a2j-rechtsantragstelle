import { createMachine } from "xstate";
import { happyPathData } from "tests/fixtures/prozesskostenhilfeFormularData";
import type { TestCases } from "~/flows/__test__/TestCases";
import {
  prozesskostenhilfeFormular,
  ProzesskostenhilfeFormularContext,
} from "~/flows/prozesskostenhilfeFormular";
import { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...prozesskostenhilfeFormular.config, context: {} },
  { guards: prozesskostenhilfeFormular.guards },
);

const cases = [
  [
    happyPathData,
    [
      "start/start",
      "finanzielle-angaben/start",
      "finanzielle-angaben/partner/partnerschaft",
      "finanzielle-angaben/partner/zusammenleben",
      "finanzielle-angaben/partner/partner-einkommen",
      "finanzielle-angaben/partner/partner-einkommen-summe",
      "finanzielle-angaben/kinder/kinder-frage",
      "finanzielle-angaben/kinder/uebersicht",
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      "finanzielle-angaben/eigentum/eigentum-info",
      "finanzielle-angaben/eigentum/heirat-info",
      "finanzielle-angaben/eigentum/bankkonten-frage",
      "finanzielle-angaben/eigentum/geldanlagen-frage",
      "finanzielle-angaben/eigentum/wertgegenstaende-frage",
      "finanzielle-angaben/eigentum/grundeigentum-frage",
      "finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
      "finanzielle-angaben/eigentum/gesamtwert",
      "finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",
      "abgabe/art",
      "abgabe/ausdrucken",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFormularContext>;

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases,
};
