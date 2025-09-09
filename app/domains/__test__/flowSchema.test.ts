import z from "zod";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { beratungshilfeVorabcheckTestCases } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";

const flowSchemaTests = { beratungshilfeVorabcheckTestCases };

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
                // Without userInput we don't expect a pageSchema
                expect(pageSchema).toBeUndefined();
              } else {
                // With userInput we expect to validate against the pageSchema
                expect(pageSchema).toBeDefined();
                const validationResult = z
                  .object(pageSchema!)
                  .safeParse(userInput);
                expect(validationResult.error).toBeUndefined();
              }

              const flowController = buildFlowController({
                config: xstateConfig,
                data: userInput,
              });

              // Given the current data and url we expect the next url
              const nextStepId = expectedSteps[idx + 1]?.stepId;
              expect(flowController.getNext(stepId)).toBe(flowId + nextStepId);
            });
          });
        });
      });
    },
  );
});
