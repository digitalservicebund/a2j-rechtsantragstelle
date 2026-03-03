import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { createLegalAssessment } from "../createLegalAssessment";
import { addRechtlicheWuerdigung } from "../addRechtlicheWuerdigung";
import { addDisputeResolution } from "../addDisputeResolution";
import { addAdvanceCourtAndPlaintiffName } from "../addAdvanceCourtAndPlaintiffName";

vi.mock("../addRechtlicheWuerdigung");
vi.mock("../addDisputeResolution");
vi.mock("../addAdvanceCourtAndPlaintiffName");

vi.mocked(addRechtlicheWuerdigung).mockImplementation(() => vi.fn());
vi.mocked(addDisputeResolution).mockImplementation(() => vi.fn());
vi.mocked(addAdvanceCourtAndPlaintiffName).mockImplementation(() => vi.fn());

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createLegalAssessment", () => {
  it("should add III title when evidences section is shown", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock, true);

    expect(mockDoc.text).toHaveBeenCalledWith("III. Rechtliche Würdigung");
  });

  it("should add II title when evidences section is hidden", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock, false);

    expect(mockDoc.text).toHaveBeenCalledWith("II. Rechtliche Würdigung");
  });

  it("should call the addRechtlicheWuerdigung for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock, true);

    expect(addRechtlicheWuerdigung).toBeCalledTimes(1);
  });

  it("should call the addDisputeResolution for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock, true);

    expect(addDisputeResolution).toBeCalledTimes(1);
  });

  it("should call the addAdvanceCourtAndPlaintiffName for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock, true);

    expect(addAdvanceCourtAndPlaintiffName).toBeCalledTimes(1);
  });
});
