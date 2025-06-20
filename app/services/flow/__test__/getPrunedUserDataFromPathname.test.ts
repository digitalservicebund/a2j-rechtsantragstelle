import { pruneIrrelevantData } from "~/services/flow/pruner";
import { getPrunedUserDataFromPathname } from "../getPrunedUserDataFromPathname";

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

describe("getPrunedUserDataFromPathname", () => {
  it("should return user data with page data and valid flow paths", async () => {
    const mockPathname = "/fluggastrechte/formular/stepId1/2";

    const { userDataWithPageData, validFlowPaths } =
      await getPrunedUserDataFromPathname(mockPathname, "");

    expect(userDataWithPageData).toBe(mockPrunerData.prunedData);
    expect(validFlowPaths).toBe(mockPrunerData.validFlowPaths);
  });
});
