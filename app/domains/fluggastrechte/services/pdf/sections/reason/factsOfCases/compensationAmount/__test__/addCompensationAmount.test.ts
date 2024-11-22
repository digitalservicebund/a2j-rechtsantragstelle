import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addNewPageInCaseMissingVerticalSpace } from "../../../addNewPageInCaseMissingVerticalSpace";
import {
  addCompensationAmount,
  DEMANDED_COMPENSATION_PAYMENT_TEXT,
  OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT,
} from "../addCompensationAmount";
import { addDistanceInfo } from "../addDistanceInfo";
import { addMultiplePersonsInfo } from "../addMultiplePersonsInfo";
import { addOtherDetailsItinerary } from "../addOtherDetailsItinerary";
import { addWitnessesInfo } from "../addWitnessesInfo";

vi.mock("../../../addNewPageInCaseMissingVerticalSpace");
vi.mock("../addMultiplePersonsInfo");
vi.mock("../addOtherDetailsItinerary");
vi.mock("../addWitnessesInfo");
vi.mock("../addDistanceInfo");

vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);
vi.mocked(addOtherDetailsItinerary).mockImplementation(() => vi.fn());
vi.mocked(addWitnessesInfo).mockImplementation(() => vi.fn());
vi.mocked(addDistanceInfo).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("addCompensationAmount", () => {
  it("should call addOtherDetailsItinerary", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(addOtherDetailsItinerary).toBeCalledTimes(1);
  });

  it("should call addDistanceInfo", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(addDistanceInfo).toBeCalledTimes(1);
  });

  it("should have the text for demanded compensation payment in case claim is for one person ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      DEMANDED_COMPENSATION_PAYMENT_TEXT,
    );
  });

  it("should have the text for other passengers demanded compensation payment in case claim is multiple persons ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.Enum.yes,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT,
    );
  });

  it("should call addNewPageInCaseMissingVerticalSpace once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(1);
  });

  it("should call addMultiplePersonsInfo once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(addMultiplePersonsInfo).toBeCalledTimes(1);
  });

  it("should call addWitnessesInfo once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock);

    expect(addWitnessesInfo).toBeCalledTimes(1);
  });
});
