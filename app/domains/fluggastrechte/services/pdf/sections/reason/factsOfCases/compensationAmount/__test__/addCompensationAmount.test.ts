import { Result } from "true-myth";
import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/domains/fluggastrechte/services/airports/getCompensationPayment";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addNewPageInCaseMissingVerticalSpace } from "../../../addNewPageInCaseMissingVerticalSpace";
import {
  addCompensationAmount,
  ARTICLE_AIR_PASSENGER_REGULATION_TEXT,
  DEMANDED_COMPENSATION_PAYMENT_TEXT,
  OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT,
} from "../addCompensationAmount";
import { addMultiplePersonsInfo } from "../addMultiplePersonsInfo";
import { addOtherDetailsItinerary } from "../addOtherDetailsItinerary";
import { addWitnessesInfo } from "../addWitnessesInfo";

vi.mock("~/domains/fluggastrechte/services/airports/getCompensationPayment");
vi.mock("~/domains/fluggastrechte/services/airports/getAirportNameByIataCode");
vi.mock(
  "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports",
);
vi.mock("../../../addNewPageInCaseMissingVerticalSpace");
vi.mock("../addMultiplePersonsInfo");
vi.mock("../addOtherDetailsItinerary");
vi.mock("../addWitnessesInfo");

const distanceValueMock = 100;

vi.mocked(calculateDistanceBetweenAirportsInKilometers).mockReturnValue(
  Result.ok(distanceValueMock),
);

const compensationValueMock = "400";

vi.mocked(getCompensationPayment).mockReturnValue(compensationValueMock);

const startAirportMock = "BERLIN";
const endAirportMock = "NEW YORK";

vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
  if (airport === "BER") {
    return startAirportMock;
  }

  return endAirportMock;
});

vi.mocked(addNewPageInCaseMissingVerticalSpace).mockImplementation(() =>
  vi.fn(),
);

vi.mocked(addOtherDetailsItinerary).mockImplementation(() => vi.fn());

vi.mocked(addWitnessesInfo).mockImplementation(() => vi.fn());

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

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

    expect(addOtherDetailsItinerary).toBeCalledTimes(1);
  });

  it("should have the text for demanded compensation payment in case claim is for one person ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

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

    addCompensationAmount(mockDoc, mockStruct, userDataWeiterePersonenMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT,
    );
  });

  it("should have the text distance airport", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.Enum.no,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataWeiterePersonenMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Distanz zwischen ${startAirportMock} und ${endAirportMock} beträgt nach Großkreismethode ca. ${distanceValueMock} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationValueMock} €.`,
      PDF_MARGIN_HORIZONTAL,
      undefined,
    );
  });

  it("should have the text distance airport for multiple persons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.Enum.yes,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataWeiterePersonenMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Distanz zwischen ${startAirportMock} und ${endAirportMock} beträgt nach Großkreismethode ca. ${distanceValueMock} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationValueMock} € pro Person, insgesamt aus eigenem und abgetretenem Recht damit eine Gesamtsumme von ${compensationValueMock} €.`,
      PDF_MARGIN_HORIZONTAL,
      undefined,
    );
  });

  it("should call addNewPageInCaseMissingVerticalSpace two times", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(2);
  });

  it("should call addMultiplePersonsInfo once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

    expect(addMultiplePersonsInfo).toBeCalledTimes(1);
  });

  it("should call addWitnessesInfo once", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

    expect(addWitnessesInfo).toBeCalledTimes(1);
  });
});
