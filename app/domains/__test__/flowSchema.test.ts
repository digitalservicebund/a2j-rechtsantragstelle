import z from "zod";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { beratungshilfeVorabcheckTestCases } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";
import type { FlowTestCases } from "./TestCases";

const flowSchemaTests = { beratungshilfeVorabcheckTestCases };

// Build full user input from all previous expectedSteps
const buildFullUserInput = (
  expectedSteps: FlowTestCases["testcases"][string],
  idx: number,
) =>
  expectedSteps
    .slice(0, idx + 1)
    .reduce((acc, step) => ({ ...acc, ...step.userInput }), {});

describe("flowSchemas", () => {
  Object.entries(flowSchemaTests).forEach(
    ([testConfigName, { xstateConfig, testcases }]) => {
      const flowId = xstateConfig.id;

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
                  .object(pageSchema!)
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
            });
          });
        });
      });
    },
  );
});
