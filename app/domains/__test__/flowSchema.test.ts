import { createMachine } from "xstate";
import z from "zod";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import type { FlowTestCases } from "./TestCases";
import { kontopfaendungWegweiserTestCases } from "../kontopfaendung/wegweiser/__test__/testcasesWithUserInputs";
import { type Config } from "~/services/flow/server/types";
import { allStepsFromMachine } from "./allStepsFromMachine";
import { beratungshilfeVorabcheckTestCases } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";
import { beratungshilfeAntragTestCases } from "~/domains/beratungshilfe/formular/__test__/testcasesWithUserInputs";
import { removeArrayIndex } from "~/util/array";

const flowSchemaTests = {
  beratungshilfeAntragTestCases,
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
        Object.entries(testcases).forEach(
          ([testName, expectedSteps]: [
            string,
            FlowTestCases["testcases"][string],
          ]) => {
            test(testName, () => {
              let [isAddingArrayItem, overviewPageStepId]: [boolean, string?] =
                [false, undefined];
              expectedSteps
                .slice(0, -1)
                .forEach(({ stepId, addArrayItemStep, userInput }, idx) => {
                  const currentUrl = flowId + stepId;
                  const pageSchema = getPageSchema(currentUrl);

                  // If we re-encounter the array overview page after adding an array item, we exit the special subroutine
                  if (isAddingArrayItem && stepId === overviewPageStepId) {
                    isAddingArrayItem = false;
                    overviewPageStepId = undefined;
                  }

                  /**
                   * We are both
                   * 1. on an array overview page
                   * 2. calling the add-arrayItem event
                   *
                   * Start the special subroutine to handle array items
                   */
                  if (addArrayItemStep) {
                    isAddingArrayItem = true;
                    overviewPageStepId = stepId;
                  }

                  // Without userInput we don't expect a pageSchema. Same for Array Overview pages
                  if (!userInput || addArrayItemStep) {
                    expect(pageSchema).toBeUndefined();
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

                  if (isAddingArrayItem) {
                    if (addArrayItemStep) {
                      // forward
                      expect(
                        flowController.getArrayItemStep(
                          stepId,
                          addArrayItemStep,
                        ),
                      ).toBe(flowId + nextStepId);
                    } else {
                      expect(
                        flowController.getNext(removeArrayIndex(stepId)),
                      ).toBe(flowId + removeArrayIndex(nextStepId));
                    }

                    // backward
                    if (nextStepId !== overviewPageStepId) {
                      expect(
                        flowController.getPrevious(
                          removeArrayIndex(nextStepId),
                        ),
                      ).toBe(removeArrayIndex(currentUrl));
                    }
                  } else {
                    expect(flowController.getNext(stepId)).toBe(
                      flowId + nextStepId,
                    );
                    expect(flowController.getPrevious(nextStepId)).toBe(
                      currentUrl,
                    );
                  }

                  allVisitedSteps[flowId].visitedSteps.add(stepId);
                  allVisitedSteps[flowId].visitedSteps.add(nextStepId);
                });
            });
          },
        );
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
    ).toBeLessThanOrEqual(71);
  });
});
