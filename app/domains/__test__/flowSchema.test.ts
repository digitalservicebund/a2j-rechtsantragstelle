import { createMachine } from "xstate";
import z from "zod";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import type { FlowTestCases } from "./TestCases";
import { kontopfaendungWegweiserTestCases } from "../kontopfaendung/wegweiser/__test__/testcasesWithUserInputs";
import { type Config } from "~/services/flow/server/types";
import { allStepsFromMachine } from "./allStepsFromMachine";
import { beratungshilfeVorabcheckTestCases } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";

const flowSchemaTests = {
  beratungshilfeVorabcheckTestCases,
  kontopfaendungWegweiserTestCases,
};

// Build full user input from all previous expectedSteps
const buildFullUserInput = (
  expectedSteps: FlowTestCases["testcases"][string],
  idx: number,
) =>
  expectedSteps
    .slice(0, idx + 1)
    .reduce((acc, step) => ({ ...acc, ...step.userInput }), {});

describe.sequential("flowSchemas", () => {
  const allVisitedSteps: Record<
    string,
    { visitedSteps: Set<string | undefined>; xstateConfig: Config }
  > = {};

  Object.entries(flowSchemaTests).forEach(
    ([testConfigName, { xstateConfig, testcases }]) => {
      const flowId = xstateConfig.id;

      if (!allVisitedSteps[flowId]) {
        allVisitedSteps[flowId] = { xstateConfig, visitedSteps: new Set() };
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
              expect(flowController.getNext(stepId)).toBe(flowId + nextStepId);
              expect(flowController.getPrevious(nextStepId)).toBe(currentUrl);

              allVisitedSteps[flowId].visitedSteps.add(stepId);
              allVisitedSteps[flowId].visitedSteps.add(nextStepId);
            });
          });
        });
      });
    },
  );

  test("all steps are visited", () => {
    const missingStepsEntries = Object.entries(allVisitedSteps)
      .map(([flowId, { xstateConfig, visitedSteps }]) => {
        const missingSteps = allStepsFromMachine(
          createMachine(xstateConfig),
        ).filter((x) => !visitedSteps.has(x));
        // .filter((x) => !ignoreVisitedSteps.includes(x));
        return [flowId, missingSteps];
      })
      .filter(([_, missingSteps]) => missingSteps.length > 0);

    const totalMissingStepCount = missingStepsEntries.reduce(
      (total, [_, missingSteps]) => total + missingSteps.length,
      0,
    );

    expect(
      totalMissingStepCount,
      `Untested stepIds: ${JSON.stringify(Object.fromEntries(missingStepsEntries))}`,
    ).toBeLessThanOrEqual(0);
  });
});
