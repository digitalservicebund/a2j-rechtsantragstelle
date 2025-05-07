import { describe, it, expect, type Mock } from "vitest";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";
import { getRelevantFiles } from "../getRelevantFiles";

vi.mock("~/services/externalDataStorage/userFileS3Helpers", () => ({
  downloadUserFileFromS3: vi.fn(),
}));

describe("getRelevantFiles", () => {
  const sessionId = "test-session-id";
  const flowId = "/beratungshilfe/antrag";

  it("should return an empty array when condition is false", async () => {
    const evidence = [{ savedFileKey: "file1" }];
    const result = await getRelevantFiles(evidence, sessionId, flowId, false);
    expect(result).toEqual([]);
  });

  it("should call downloadUserFileFromS3 for each file when condition is true", async () => {
    const evidence = [{ savedFileKey: "file1" }, { savedFileKey: "file2" }];
    const mockFileData = new Uint8Array([1, 2, 3]);
    (downloadUserFileFromS3 as Mock).mockResolvedValue(mockFileData);

    const result = await getRelevantFiles(evidence, sessionId, flowId, true);

    expect(downloadUserFileFromS3).toHaveBeenCalledTimes(2);
    expect(downloadUserFileFromS3).toHaveBeenCalledWith(
      sessionId,
      flowId,
      "file1",
    );
    expect(downloadUserFileFromS3).toHaveBeenCalledWith(
      sessionId,
      flowId,
      "file2",
    );
    expect(result).toEqual([mockFileData, mockFileData]);
  });
});
