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
  it("should add a title for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("III. Rechtliche Würdigung");
  });

  it("should call the addRechtlicheWuerdigung for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addRechtlicheWuerdigung).toBeCalledTimes(1);
  });

  it("should call the addDisputeResolution for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addDisputeResolution).toBeCalledTimes(1);
  });

  it("should call the addAdvanceCourtAndPlaintiffName for the legal assessment section", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLegalAssessment(mockDoc, mockStruct, userDataMock);

    expect(addAdvanceCourtAndPlaintiffName).toBeCalledTimes(1);
  });
});
