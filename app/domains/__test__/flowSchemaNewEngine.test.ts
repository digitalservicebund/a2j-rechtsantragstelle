import z from "zod";
import merge from "lodash/merge";
import { getPageSchema } from "../pageSchemas";
import type { ExpectedStep, ExpectedStepUserInput } from "./TestCases";
import { removeArrayIndex } from "~/util/array";
import { type SchemaObject, type UserData } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";
import {
  createFlowSession,
  type FlowSession,
} from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { geldEinklagenFormularTestCases } from "../geldEinklagen/formular/__test__/testCaseWithUserInput";
import { kontopfaendungWegweiserTestCases } from "../kontopfaendung/wegweiser/__test__/testcasesWithUserInputs";

const flowSchemaTests = {
  geldEinklagenFormularTestCases,
  kontopfaendungWegweiserTestCases,
};

type VisitedSteps = Record<
  string,
  {
    visitedSteps: Set<string | undefined>;
    newEngineConfig: CompiledFlow<PageConfigMap>;
  }
>;

// Build full user input from all previous expectedSteps
const buildFullUserInput = <T extends UserData>(
  expectedSteps: Array<ExpectedStep<T>>,
  idx: number,
) => {
  return expectedSteps.slice(0, idx + 1).reduce((acc, step) => {
    let merged: ExpectedStepUserInput<UserData> = { ...acc, ...step.userInput };

    // This assignment is useful for injecting pageData, like subflowDoneStates
    merged.pageData = { ...merged.pageData, ...step.pageData };

    // When adding an array item, increment the last array index or start with 0
    if (step.addArrayItemEvent) {
      merged.pageData = {
        ...merged.pageData,
        arrayIndexes: merged.pageData?.arrayIndexes
          ? [merged.pageData?.arrayIndexes.at(-1)! + 1]
          : [0],
      };
      return merged;
    }

    // Extract array indexes from stepId (e.g., "/step/0/nested/1" -> [0, 1])
    const arrayIndexes = parseArrayIndexesFromPathname(step.stepId);

    // If step contains array indexes, add them to pageData and resolve array-indexed fields
    if (arrayIndexes.length > 0) {
      merged.pageData = { ...merged.pageData, arrayIndexes };

      // Get the last array index
      const lastIndex = arrayIndexes.at(-1);
      if (lastIndex === undefined) return merged;

      // Transform array fields like `field[index]` into nested structure `field: [index: value]`
      const resolvedArraysFromKeys = resolveArraysFromKeys(
        { ...step.userInput },
        [lastIndex],
      );
      merged = merge(merged, resolvedArraysFromKeys);
    }
    return merged;
  }, {});
};

function testPageSchema<T extends UserData>(
  userInput: ExpectedStepUserInput<T>,
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

function testArrayLinkPages(
  flowSessionEngine: FlowSession<PageConfigMap>,
  stepId: string,
  nextStepId: string,
  addArrayItemEvent?: ArrayConfigServer["event"],
  summaryPageStepId?: string,
) {
  // Special handling if we're starting from an Overview page
  if (addArrayItemEvent) {
    expect(flowSessionEngine.nextPath).toBe(nextStepId);
  } else {
    expect(flowSessionEngine.nextPath).toBe(removeArrayIndex(nextStepId));
  }

  // Only test "BACK" linkage if we're not on the summary page
  if (nextStepId !== summaryPageStepId) {
    expect(flowSessionEngine.prevPath).toBe(removeArrayIndex(stepId));
  }
}

function runTestcases<T extends UserData>(
  testName: string,
  flowId: string,
  newEngineConfig: CompiledFlow<PageConfigMap>,
  expectedSteps: Array<ExpectedStep<T>>,
  allVisitedSteps: VisitedSteps,
) {
  test(testName, () => {
    let [isAddingArrayItem, summaryPageStepId]: [boolean, string?] = [
      false,
      undefined,
    ];
    expectedSteps
      .slice(0, -1)
      .forEach(
        (
          { stepId, addArrayItemEvent, skipPageSchemaValidation, userInput },
          idx,
        ) => {
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

          if (!skipPageSchemaValidation && userInput) {
            testPageSchema(userInput, pageSchema, addArrayItemEvent);
          }

          const flowSessionEngine = createFlowSession(
            newEngineConfig,
            buildFullUserInput(expectedSteps, idx) as Parameters<
              typeof createFlowSession
            >[1],
            stepId,
          );

          // Given the current data and url we expect the next and previous url
          const nextStepId = expectedSteps[idx + 1]?.stepId;

          if (isAddingArrayItem) {
            testArrayLinkPages(
              flowSessionEngine,
              stepId,
              nextStepId,
              addArrayItemEvent,
              summaryPageStepId,
            );
          } else {
            expect(flowSessionEngine.nextPath).toBe(nextStepId);

            if (idx > 0) {
              const previousStepId = expectedSteps[idx - 1].stepId;
              expect(flowSessionEngine.prevPath).toBe(previousStepId);
            }
          }

          allVisitedSteps[flowId].visitedSteps.add(removeArrayIndex(stepId));
          allVisitedSteps[flowId].visitedSteps.add(
            removeArrayIndex(nextStepId),
          );
        },
      );
  });
}

describe("flowSchemasNewEngine", { concurrent: false }, () => {
  const allVisitedSteps: VisitedSteps = {};

  afterAll(() => {
    const missingStepsEntries = Object.entries(allVisitedSteps)
      .map(([flowId, { newEngineConfig, visitedSteps }]) => {
        const allPaths = Object.keys(newEngineConfig.pages).map(
          (pageId) => newEngineConfig.pages[pageId].stepId,
        );
        const missingSteps = allPaths.filter((x) => !visitedSteps.has(x));
        return [flowId, missingSteps];
      })
      .filter(([_, missingSteps]) => missingSteps.length > 0);

    const totalMissingStepCount = missingStepsEntries.reduce(
      (total, [_, missingSteps]) => total + missingSteps.length,
      0,
    );

    if (totalMissingStepCount > 0) {
      // oxlint-disable-next-line no-console
      console.warn(
        `Total of ${totalMissingStepCount} untested stepIds: `,
        Object.fromEntries(missingStepsEntries),
      );
    }
  });

  Object.entries(flowSchemaTests).forEach(
    ([testConfigName, { xstateConfig, testcases, newEngineConfig }]) => {
      //TODO: Add later the flowId in the Testcase type, so we don't depend of the xstateConfig.id here. This is a temporary solution to get the flowId for the testcases.
      const flowId = xstateConfig.id!;

      if (newEngineConfig === undefined) {
        throw new Error(
          `Missing newEngineConfig for flowId: ${flowId}. Please provide a valid newEngineConfig in the testcases for ${testConfigName}.`,
        );
      }

      if (!allVisitedSteps[flowId]) {
        allVisitedSteps[flowId] = {
          visitedSteps: new Set(),
          newEngineConfig,
        };
      }

      describe(testConfigName, () => {
        Object.entries(testcases).forEach(([testName, expectedSteps]) =>
          runTestcases(
            testName,
            flowId,
            newEngineConfig,
            expectedSteps,
            allVisitedSteps,
          ),
        );
      });
    },
  );
});
