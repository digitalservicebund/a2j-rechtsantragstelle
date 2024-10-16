import { describe, it, expect, vi } from "vitest";
import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createClaimData } from "../claimData/createClaimData";
import { createFlightCompensationClaim } from "../createFlightCompensationClaim";

vi.mock("../claimData/createClaimData");

vi.mocked(createClaimData).mockImplementation(() => vi.fn());

describe("createFlightCompensationClaim", () => {
  it("should create a flight compensation claim section and add it to the document structure", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createFlightCompensationClaim(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(createClaimData).toHaveBeenCalledWith(
      mockDoc,
      expect.any(Object),
      userDataMock,
    );
    expect(mockStruct.add).toHaveBeenCalledWith(expect.any(Object));
  });
});
