import z from "zod";
import { beratungshilfeVorabcheckXstateConfig } from "../beratungshilfe/vorabcheck/xstateConfig";
import { getPageSchema } from "../pageSchemas";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { beratungshilfeVorabcheckE2E } from "../beratungshilfe/vorabcheck/__test__/testcasesWithUserInputs";

describe("beratungshilfeVorabcheck", () => {
  const xstateConfig = beratungshilfeVorabcheckXstateConfig;
  const { flowId, expectedSteps } = beratungshilfeVorabcheckE2E;

  it("can be traversed", () => {
    expectedSteps.slice(0, -1).forEach(({ url, userInput }, idx) => {
      const pageSchema = getPageSchema(flowId + url);
      if (!userInput) {
        expect(pageSchema).toBeUndefined();
      } else {
        expect(pageSchema).toBeDefined();
        const validationResult = z.object(pageSchema!).safeParse(userInput);
        expect(validationResult.error).toBeUndefined();
      }

      const flowController = buildFlowController({
        config: xstateConfig,
        data: userInput,
      });

      const expectedNextUrl = flowId + expectedSteps[idx + 1]?.url;
      expect(flowController.getNext(url)).toBe(expectedNextUrl);
    });
  });
});
