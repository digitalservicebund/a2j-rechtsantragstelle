import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addNewPageInCaseMissingVerticalSpace } from "../../../addNewPageInCaseMissingVerticalSpace";
import {
  addWitnessesInfo,
  PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT,
  PLAINTIFF_WITNESSES_TEXT,
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

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
      isWeiterePersonen: YesNoAnswer.Enum.yes,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should not have the text for plaintiff witnesses in case the hasZeugen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock);

    expect(mockDoc.text).not.toHaveBeenCalledWith(PLAINTIFF_WITNESSES_TEXT);
  });

  it("should call addNewPageInCaseMissingVerticalSpace in case the hasZeugen is yes ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(1);
  });

  it("should not call addNewPageInCaseMissingVerticalSpace in case the hasZeugen is no ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasNoZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasNoZeugenMock);

    expect(addNewPageInCaseMissingVerticalSpace).not.toBeCalled();
  });
});
