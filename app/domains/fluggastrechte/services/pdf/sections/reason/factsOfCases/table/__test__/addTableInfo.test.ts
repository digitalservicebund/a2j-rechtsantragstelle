import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../../addNewPageInCaseMissingVerticalSpace";
import { addTableInfo, HEADLINE } from "../addTableInfo";

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

describe("addTableInfo", () => {
  it("should add a section with a paragraph containing the specified description", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const andereErsatzverbindungBeschreibung = "Sample description";

    addTableInfo(mockDoc, mockStruct, andereErsatzverbindungBeschreibung);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");

    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.fontSize).toHaveBeenCalledWith(10);
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(HEADLINE, PDF_MARGIN_HORIZONTAL);
    expect(mockDoc.text).toHaveBeenCalledWith(
      andereErsatzverbindungBeschreibung,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should call addNewPageInCaseMissingVerticalSpace once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const andereErsatzverbindungBeschreibung = "Sample description";

    addTableInfo(mockDoc, mockStruct, andereErsatzverbindungBeschreibung);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(1);
  });
});
