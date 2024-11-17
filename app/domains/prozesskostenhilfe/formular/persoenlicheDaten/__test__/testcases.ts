import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfePersoenlicheDaten } from "../context";
import { getProzesskostenhilfePersoenlicheDatenXstateConfig } from "../xstateConfig";

const machine: FlowStateMachine = createMachine(
  getProzesskostenhilfePersoenlicheDatenXstateConfig(),
);

const cases = [
  [
    {},
    [
      "/start",
      "/name",
      "/geburtsdatum",
      "/adresse",
      "/telefonnummer",
      "/beruf",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfePersoenlicheDaten>;

export const testCasesProzesskostenhilfePersoenlicheDaten = {
  machine,
  cases,
};
