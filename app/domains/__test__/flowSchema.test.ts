import { createMachine } from "xstate";
import z from "zod";
import { getPageSchema } from "../pageSchemas";
import {
  buildFlowController,
  type FlowController,
} from "~/services/flow/server/buildFlowController";
import type { ExpectedStep, FlowTestCases } from "./TestCases";
import { kontopfaendungWegweiserTestCases } from "../kontopfaendung/wegweiser/__test__/testcasesWithUserInputs";
import { type Config } from "~/services/flow/server/types";
import { allStepsFromMachine } from "./allStepsFromMachine";
import { beratungshilfeVorabcheckTestCases } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";
import { beratungshilfeAntragTestCases } from "~/domains/beratungshilfe/formular/__test__/testcasesWithUserInputs";
import { removeArrayIndex } from "~/util/array";
import { type SchemaObject, type UserData } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";

const flowSchemaTests = {
  beratungshilfeAntragTestCases,
  beratungshilfeVorabcheckTestCases,
  kontopfaendungWegweiserTestCases,
};

type VisitedSteps = Record<
  string,
  { visitedSteps: Set<string | undefined>; xstateConfig: Config }
>;

// Build full user input from all previous expectedSteps
const buildFullUserInput = (
  expectedSteps: FlowTestCases["testcases"][string],
  idx: number,
) =>
  expectedSteps
    .slice(0, idx + 1)
    .reduce((acc, step) => ({ ...acc, ...step.userInput }), {});

function testPageSchema(
  userInput: UserData | undefined,
  pageSchema: SchemaObject | undefined,
  addArrayItemEvent?: ArrayConfigServer["event"],
) {
  // Without userInput we don't expect a pageSchema. Same for Array Overview pages
  if (!userInput || addArrayItemEvent) {
    expect(pageSchema).toBeUndefined();
  } else {
    expect(pageSchema).toBeDefined(); // With userInput we expect it to validate against the pageSchema
    const validationResult = z.object(pageSchema).safeParse(userInput);
    expect(validationResult.error).toBeUndefined();
  }
}

function testXstateArrayLinkages(
  flowController: FlowController,
  stepId: string,
  flowId: string,
  nextStepId: string,
  addArrayItemEvent?: ArrayConfigServer["event"],
  summaryPageStepId?: string,
) {
  // Special handling if we're starting from an Overview page
  if (addArrayItemEvent) {
    expect(flowController.getArrayItemStep(stepId, addArrayItemEvent)).toBe(
      flowId + nextStepId,
    );
  } else {
    expect(flowController.getNext(removeArrayIndex(stepId))).toBe(
      flowId + removeArrayIndex(nextStepId),
    );
  }

  // Only test "BACK" linkage if we're not on the summary page
  if (nextStepId !== summaryPageStepId) {
    expect(flowController.getPrevious(removeArrayIndex(nextStepId))).toBe(
      removeArrayIndex(flowId + stepId),
    );
  }
}

function runTestcases(
  testName: string,
  flowId: string,
  xstateConfig: Config,
  expectedSteps: ExpectedStep[],
  allVisitedSteps: VisitedSteps,
) {
  test(testName, () => {
    let [isAddingArrayItem, summaryPageStepId]: [boolean, string?] = [
      false,
      undefined,
    ];
    expectedSteps
      .slice(0, -1)
      .forEach(({ stepId, addArrayItemEvent, userInput }, idx) => {
        const currentUrl = flowId + stepId;
        const pageSchema = getPageSchema(currentUrl);

        // If we re-encounter the array overview page after adding an array item, we exit the special subroutine
        if (isAddingArrayItem && stepId === summaryPageStepId) {
          isAddingArrayItem = false;
          summaryPageStepId = undefined;
        }

        /**
         * We are both
         * 1. on an array overview page
         * 2. calling the add-arrayItem event
         *
         * Start the special subroutine to handle array items
         */
        if (addArrayItemEvent) {
          isAddingArrayItem = true;
          summaryPageStepId = stepId;
        }

        testPageSchema(userInput, pageSchema, addArrayItemEvent);

        const flowController = buildFlowController({
          config: xstateConfig,
          data: buildFullUserInput(expectedSteps, idx),
        });

        // Given the current data and url we expect the next and previous url
        const nextStepId = expectedSteps[idx + 1]?.stepId;

        if (isAddingArrayItem) {
          testXstateArrayLinkages(
            flowController,
            stepId,
            flowId,
            nextStepId,
            addArrayItemEvent,
            summaryPageStepId,
          );
        } else {
          expect(flowController.getNext(stepId)).toBe(flowId + nextStepId);
          expect(flowController.getPrevious(nextStepId)).toBe(currentUrl);
        }

        allVisitedSteps[flowId].visitedSteps.add(stepId);
        allVisitedSteps[flowId].visitedSteps.add(nextStepId);
      });
  });
}

describe.sequential("flowSchemas", () => {
  const allVisitedSteps: VisitedSteps = {};

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
          ]) =>
            runTestcases(
              testName,
              flowId,
              xstateConfig,
              expectedSteps,
              allVisitedSteps,
            ),
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
