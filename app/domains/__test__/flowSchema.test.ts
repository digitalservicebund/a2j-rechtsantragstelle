import { createMachine } from "xstate";
import z from "zod";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import type { FlowTestCases } from "./TestCases";
import { FlowStateMachine } from "~/services/flow/server/types";
import { beratungshilfeVorabcheck } from "~/domains/beratungshilfe/vorabcheck";
import { allStepsFromMachine } from "~/services/flow/xStateMachineUtils";

const flowSchemas = { beratungshilfeVorabcheck };

// Build full user input from all previous expectedSteps
const buildFullUserInput = (
  expectedSteps: FlowTestCases[string],
  idx: number,
) =>
  expectedSteps
    .slice(0, idx + 1)
    .reduce((acc, step) => ({ ...acc, ...step.userInput }), {});

describe("flowSchemas", () => {
  const allVisitedSteps: Record<
    string,
    { stepIds: Set<string | undefined>; machine: FlowStateMachine }
  > = {};
  Object.entries(flowSchemas).forEach(([testConfigName, schema]) => {
    const { config: xstateConfig, testcases, guards } = schema;
    const flowId = xstateConfig.id;
    const machine: FlowStateMachine = createMachine(xstateConfig, { guards });
    if (!allVisitedSteps[machine.id]) {
      allVisitedSteps[machine.id] = { machine, stepIds: new Set() };
    }

    describe(testConfigName, () => {
      Object.entries(testcases).forEach(([testName, expectedSteps]) => {
        test(testName, () => {
          expectedSteps.slice(0, -1).forEach(({ stepId, userInput }, idx) => {
            const currentUrl = flowId + stepId;
            const pageSchema = getPageSchema(currentUrl);

            if (!userInput) {
              expect(pageSchema).toBeUndefined(); // Without userInput we don't expect a pageSchema
            } else {
              expect(pageSchema).toBeDefined(); // With userInput we expect it to validate against the pageSchema
              const validationResult = z
                .object(pageSchema)
                .safeParse(userInput);
              expect(validationResult.error).toBeUndefined();
            }

            const flowController = buildFlowController({
              config: xstateConfig,
              data: buildFullUserInput(expectedSteps, idx),
            });

            // Given the current data and url we expect the next and previous url
            const nextStepId = expectedSteps[idx + 1]?.stepId;
            allVisitedSteps[machine.id].stepIds.add(
              flowController.getPrevious(nextStepId)?.replace(flowId, ""),
            );
            allVisitedSteps[machine.id].stepIds.add(
              flowController.getNext(stepId)?.replace(flowId, ""),
            );
            expect(flowController.getNext(stepId)).toBe(flowId + nextStepId);
            expect(flowController.getPrevious(nextStepId)).toBe(currentUrl);
          });
        });
      });
    });
  });

  test("all steps are visited", () => {
    const missingStepsEntries = Object.entries(allVisitedSteps)
      .map(([machineId, { machine, stepIds }]) => {
        const visitedSteps = new Set(stepIds);
        const missingSteps = allStepsFromMachine(machine).filter(
          (x) => !visitedSteps.has(x),
        );
        // .filter((x) => !ignoreVisitedSteps.includes(x));
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
    expect(totalMissingStepCount).toBeLessThanOrEqual(0);
  });
});
