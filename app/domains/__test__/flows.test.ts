import { toDirectedGraph, type DirectedGraphNode } from "@xstate/graph";
import { pathToStateValue } from "xstate";
import { testCasesBeratungshilfeFormular } from "~/domains/beratungshilfe/formular/__test__/testCasesBeratungshilfeFormular";
import { testCasesBeratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck/__test__/testcases";
import { testCasesFluggastrechteFormular } from "~/domains/fluggastrechte/formular/__test__/testCasesFluggastrechteFormular";
import { testCasesFluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck/__test__/testCasesFluggastrechteVorabcheck";
import { testCasesGeldEinklagen } from "~/domains/geldEinklagen/vorabcheck/__test__/testcases";
import { testCasesKontopfaendungWegweiser } from "~/domains/kontopfaendung/wegweiser/__test__/testcases";
import {
  testCasesProzesskostenhilfeFormular,
  testCasesProzesskostenhilfeSubmitOnly,
} from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import { type UserData } from "~/domains/userData";
import { nextStepId } from "~/services/flow/server/buildFlowController";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { stateValueToStepIds } from "~/services/flow/stepIdConverter";

function getEnabledSteps({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: FlowStateMachine;
  context: UserData;
  transitionType: "SUBMIT" | "BACK";
  steps: readonly string[];
}) {
  const initialStep = steps[0];
  const reachableSteps = steps.slice(0, -1).map((step) => {
    const destination = nextStepId(machine, step, transitionType, context);
    if (!destination) {
      throw Error(
        `transition destination missing for step: ${step}, transitionType: ${transitionType}`,
      );
    }
    return destination;
  });
  return [initialStep, ...reachableSteps];
}

function statePathsFromMachine(children: DirectedGraphNode[]): string[][] {
  return children.flatMap((child) =>
    child.children.length > 0
      ? statePathsFromMachine(child.children)
      : [child.stateNode.path],
  );
}

function allStepsFromMachine(machine: FlowStateMachine) {
  const machineState = statePathsFromMachine(toDirectedGraph(machine).children);
  return machineState.map(
    (statePath) => stateValueToStepIds(pathToStateValue(statePath))[0],
  );
}

/*
 * Note on testing xstate
 *
 * > testing state machines and statecharts should be done
 * > by testing the overall behavior of the machine
 * @see https://xstate.js.org/docs/guides/testing.html
 *
 * - given a current state (context/entered form data)
 * - when some sequence of events occurs (next, next, next)
 * - system under test should be in a certain state (step)
 */

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn().mockResolvedValue(false),
}));

describe.sequential("state machine form flows", () => {
  const allVisitedSteps: Record<
    string,
    { stepIds: string[]; machine: FlowStateMachine }
  > = {};

  const testCases = {
    testCasesBeratungshilfeVorabcheck,
    testCasesBeratungshilfeFormular,
    testCasesFluggastrechteFormular,
    testCasesFluggastrechteVorabcheck,
    testCasesGeldEinklagen,
    testCasesProzesskostenhilfeFormular,
    testCasesKontopfaendungWegweiser,
  } as const;
  const transitionTypes = ["SUBMIT", "BACK"] as const;

  describe.concurrent.each(Object.entries(testCases))(
    "%s",
    (_, { machine, cases }) => {
      if (!allVisitedSteps[machine.id]) {
        allVisitedSteps[machine.id] = { machine, stepIds: [] };
      }

      describe.each([...cases])("[%#]", (context, steps) => {
        test.each(transitionTypes)("%s", (transitionType) => {
          const expectedSteps =
            transitionType === "SUBMIT" ? steps : [...steps].reverse();

          const visitedSteps = getEnabledSteps({
            machine,
            context,
            transitionType,
            steps: expectedSteps,
          });

          allVisitedSteps[machine.id].stepIds =
            allVisitedSteps[machine.id].stepIds.concat(visitedSteps);

          expect(visitedSteps).toEqual(expectedSteps);
        });
      });
    },
  );

  // Some pages cannot be tested above since they aren't reachable using a `BACK` transition
  // However, we can still verify that their `SUBMIT` transition is correct
  const forwardOnlyTests = { testCasesProzesskostenhilfeSubmitOnly };

  describe.concurrent.each(Object.entries(forwardOnlyTests))(
    "%s",
    (_, { machine, cases }) => {
      test.each([...cases])("[%#]", (context, steps) => {
        const visitedSteps = getEnabledSteps({
          machine,
          context,
          transitionType: "SUBMIT",
          steps,
        });

        allVisitedSteps[machine.id].stepIds =
          allVisitedSteps[machine.id].stepIds.concat(visitedSteps);

        expect(visitedSteps).toEqual(steps);
      });
    },
  );

  test("all steps are visited", () => {
    const missingStepsEntries = Object.entries(allVisitedSteps)
      .map(([machineId, { machine, stepIds }]) => {
        const visitedSteps = new Set(stepIds);
        const missingSteps = allStepsFromMachine(machine).filter(
          (x) => !visitedSteps.has(x),
        );
        return [machineId, missingSteps] as const;
      })
      .filter(([_, missingSteps]) => missingSteps.length > 0);

    const totalMissingStepCount = missingStepsEntries.reduce(
      (total, [_, missingSteps]) => total + missingSteps.length,
      0,
    );

    // eslint-disable-next-line no-console
    console.warn(
      `Total of ${totalMissingStepCount} untested stepIds: `,
      Object.fromEntries(missingStepsEntries),
    );
    expect(totalMissingStepCount).toBeLessThanOrEqual(38);
  });
});
