import { pruneIrrelevantData } from "~/services/flow/pruner";
import { getUserPrunedDataFromPathname } from "../getUserPrunedDataFromPathname";

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

describe("getUserPrunedDataFromPathname", () => {
  it("should return user data with page data and valid flow paths", async () => {
    const mockPathname = "/fluggastrechte/formular/stepId1/2";

    const { userDataWithPageData, validFlowPaths } =
      await getUserPrunedDataFromPathname(mockPathname, "");

    expect(userDataWithPageData).toBe(mockPrunerData.prunedData);
    expect(validFlowPaths).toBe(mockPrunerData.validFlowPaths);
  });
});
