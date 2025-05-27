import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import type { FlowStateMachine } from "~/services/flow/server/types";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "../userData";
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
] as const satisfies TestCases<ProzesskostenhilfePersoenlicheDatenUserData>;

export const testCasesProzesskostenhilfePersoenlicheDaten = {
  machine,
  cases,
};
