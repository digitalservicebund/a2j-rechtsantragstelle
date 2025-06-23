import { pruneIrrelevantData } from "~/services/flow/pruner";
import { getUserPrunedDataFromRequest } from "../getUserPrunedDataFromRequest";

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

describe("getUserPrunedDataFromRequest", () => {
  it("should return user data with page data and valid flow paths", async () => {
    const mockRequest = new Request(
      "http://example.com/fluggastrechte/formular/stepId1/2",
    );

    const { userDataWithPageData, validFlowPaths } =
      await getUserPrunedDataFromRequest(mockRequest);

    expect(userDataWithPageData).toBe(mockPrunerData.prunedData);
    expect(validFlowPaths).toBe(mockPrunerData.validFlowPaths);
  });
});
