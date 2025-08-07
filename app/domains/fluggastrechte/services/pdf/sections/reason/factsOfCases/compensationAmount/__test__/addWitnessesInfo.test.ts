import { type Mock } from "vitest";
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
      hasZeugen: YesNoAnswer.enum.yes,
      isWeiterePersonen: YesNoAnswer.enum.yes,
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
      hasZeugen: YesNoAnswer.enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasZeugenMock, mockSect);

    expect(mockDoc.text).not.toHaveBeenCalledWith(WITNESS_EVIDENCE_TEXT);
    // Added to silence ESLint warning: "Add at least one assertion to this test case.eslintsonarjs/assertions-in-tests"
    expect(mockDoc.text).toBeDefined();
  });

  it("should call addNewPageInCaseMissingVerticalSpace in case the hasZeugen is yes ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");
    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.enum.yes,
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
      hasZeugen: YesNoAnswer.enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasNoZeugenMock, mockSect);

    expect(addNewPageInCaseMissingVerticalSpace).not.toBeCalled();
    // Added to silence ESLint warning: "Add at least one assertion to this test case.eslintsonarjs/assertions-in-tests"
    expect(addNewPageInCaseMissingVerticalSpace).toBeDefined();
  });
});

describe("addWitnessesInfo - accessibility", () => {
  it("should call addWitnessInfo with no paragraph if user has no witnesses", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataHasNoZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.enum.no,
    };

    addWitnessesInfo(mockDoc, userDataHasNoZeugenMock, mockSect);
    expect(mockDoc.struct).not.toHaveBeenCalledWith(
      "P",
      {},
      expect.any(Function),
    );

    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(0);
  });

  it("should call addWitnessInfo with one paragraph if user has witnesses", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataHasNoZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.enum.yes,
    };

    addWitnessesInfo(mockDoc, userDataHasNoZeugenMock, mockSect);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(1);
  });
});
