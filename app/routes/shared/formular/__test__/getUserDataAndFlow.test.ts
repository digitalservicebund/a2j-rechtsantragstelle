import { Result } from "true-myth";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getUserDataAndFlow } from "../getUserDataAndFlow";
import { validateStepIdFlow } from "../validateStepIdFlow";

const mockPrunerData = {
  prunedData: { name: "someName" },
  validFlowPaths: {
    "/grundvoraussetzungen/klage-eingereicht": {
      isArrayPage: false,
    },
  },
};

vi.mock("~/services/flow/pruner");

vi.mocked(pruneIrrelevantData).mockResolvedValue(mockPrunerData);

const mockRequest = new Request(
  "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);

const mockBuildFlowController = vi.fn() as unknown as ReturnType<
  typeof buildFlowController
>;

vi.mock("~/services/flow/server/buildFlowController");

vi.mocked(buildFlowController).mockReturnValue(mockBuildFlowController);

vi.mock("../validateStepIdFlow");

describe("getUserDataAndFlow", () => {
  it("should return an error and redirect in case the stepId is not valid", async () => {
    vi.mocked(validateStepIdFlow).mockResolvedValue(
      Result.err({ redirectTo: "redirectToPage" }),
    );

    const result = await getUserDataAndFlow(mockRequest);

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe("redirectToPage");
  });

  it("should return ok and with all the correct data", async () => {
    vi.mocked(validateStepIdFlow).mockResolvedValue(Result.ok());

    const result = await getUserDataAndFlow(mockRequest);

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      userData: mockPrunerData.prunedData,
      flow: {
        id: "/beratungshilfe/antrag",
        current: expect.anything(),
        controller: mockBuildFlowController,
        validFlowPaths: mockPrunerData.validFlowPaths,
      },
      page: {
        stepId: "/finanzielle-angaben/kinder/uebersicht",
        arrayIndexes: [],
      },
    });
  });
});
