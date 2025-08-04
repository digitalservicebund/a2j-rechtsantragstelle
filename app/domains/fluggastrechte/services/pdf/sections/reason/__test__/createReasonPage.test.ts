import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { createReasonPage, REASON_TITLE_TEXT } from "../createReasonPage";
import { addCompensationAmount } from "../factsOfCases/compensationAmount/addCompensationAmount";
import { createFactsOfCases } from "../factsOfCases/createFactsOfCases";
import { addTable } from "../factsOfCases/table/addTable";
import { createLegalAssessment } from "../legalAssessment/createLegalAssessment";

vi.mock("../factsOfCases/createFactsOfCases");
vi.mock("../legalAssessment/createLegalAssessment");
vi.mock("../factsOfCases/table/addTable");
vi.mock("../factsOfCases/compensationAmount/addCompensationAmount");

vi.mocked(createFactsOfCases).mockImplementation(() => vi.fn());
vi.mocked(createLegalAssessment).mockImplementation(() => vi.fn());
vi.mocked(addTable).mockImplementation(() => vi.fn());
vi.mocked(addCompensationAmount).mockImplementation(() => vi.fn());

describe("createReasonPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render document with reason title text", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      REASON_TITLE_TEXT,
      PDF_MARGIN_HORIZONTAL,
      mockDoc.y,

      {
        align: "left",
      },
    );
  });

  it("should call the createFactsOfCases for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createFactsOfCases).toBeCalledTimes(1);
  });

  it("should call the createLegalAssessment for the creation of the reason page", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(createLegalAssessment).toBeCalledTimes(1);
  });

  it("should call the createAdditionalInformation for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(addCompensationAmount).toBeCalledTimes(1);
  });

  it("should call the addTable for the creation facts of cases", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(addTable).toBeCalledTimes(1);
  });

  it("should set the structure tag on the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createReasonPage(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalled();
    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H2", {}, expect.any(Function));
  });
});
