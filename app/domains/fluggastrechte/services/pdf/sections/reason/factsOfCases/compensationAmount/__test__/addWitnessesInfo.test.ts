import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addNewPageInCaseMissingVerticalSpace } from "../../../addNewPageInCaseMissingVerticalSpace";
import {
  addWitnessesInfo,
  WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT,
  WITNESS_EVIDENCE_TEXT,
} from "../addWitnessesInfo";

vi.mock("../../../addNewPageInCaseMissingVerticalSpace");

vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("addWitnessesInfo", () => {
  it("should have the text for plaintiff witnesses for multiple persons in case the hasZeugen and weitere personen is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
      isWeiterePersonen: YesNoAnswer.Enum.yes,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should not have the text for plaintiff witnesses in case the hasZeugen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock, mockSect);

    expect(mockDoc.text).not.toHaveBeenCalledWith(WITNESS_EVIDENCE_TEXT);
  });

  it("should call addNewPageInCaseMissingVerticalSpace in case the hasZeugen is yes ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");
    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock, mockSect);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(1);
  });

  it("should not call addNewPageInCaseMissingVerticalSpace in case the hasZeugen is no ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataHasNoZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasNoZeugenMock, mockSect);

    expect(addNewPageInCaseMissingVerticalSpace).not.toBeCalled();
  });
});
