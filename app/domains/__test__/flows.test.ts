import { testCasesBeratungshilfeFormular } from "~/domains/beratungshilfe/formular/__test__/testCasesBeratungshilfeFormular";
import { testCasesFluggastrechteFormular } from "~/domains/fluggastrechte/formular/__test__/testCasesFluggastrechteFormular";
import { testCasesFluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck/__test__/testCasesFluggastrechteVorabcheck";
import { testCasesKontopfaendungWegweiser } from "~/domains/kontopfaendung/wegweiser/__test__/testcases";
import {
  testCasesProzesskostenhilfeFormular,
  testCasesProzesskostenhilfeSubmitOnly,
} from "~/domains/prozesskostenhilfe/formular/__test__/testcases";
import { type UserData } from "~/domains/userData";
import { allStepsFromMachine } from "~/services/flow/machineUtils";
import { nextStepId } from "~/services/flow/server/buildFlowController";
import type {
  FlowStateMachine,
  NavigationEvent,
} from "~/services/flow/server/types";

function getEnabledSteps({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: FlowStateMachine;
  context: UserData;
  transitionType: NavigationEvent;
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

const ignoreVisitedSteps = [
  "/flugdaten/check-initial-page", // this page is only used to check the initial page of the flow
  "/intro/redirect-vorabcheck-ergebnis", // this page is only used to redirect to the vorabcheck result
  "/ergebnis/erfolg-per-post-klagen", // this page is only used to redirect to a content page
];

describe.sequential("state machine form flows", () => {
  const allVisitedSteps: Record<
    string,
    { stepIds: string[]; machine: FlowStateMachine }
  > = {};

  const testCases = {
    testCasesBeratungshilfeFormular,
    testCasesFluggastrechteFormular,
    testCasesFluggastrechteVorabcheck,
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
        const missingSteps = allStepsFromMachine(machine)
          .filter((x) => !visitedSteps.has(x))
          .filter((x) => !ignoreVisitedSteps.includes(x));
        return [machineId, missingSteps] as const;
      })
      .filter(([_, missingSteps]) => missingSteps.length > 0);

    const totalMissingStepCount = missingStepsEntries.reduce(
      (total, [_, missingSteps]) => total + missingSteps.length,
      0,
    );

    // oxlint-disable-next-line no-console
    console.warn(
      `Total of ${totalMissingStepCount} untested stepIds: `,
      Object.fromEntries(missingStepsEntries),
    );
    expect(totalMissingStepCount).toBeLessThanOrEqual(38);
  });
});
