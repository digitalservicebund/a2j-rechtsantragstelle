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
  addDistanceInfo,
  ARTICLE_AIR_PASSENGER_REGULATION_TEXT,
} from "../addDistanceInfo";

vi.mock("~/domains/fluggastrechte/services/airports/getCompensationPayment");
vi.mock("~/domains/fluggastrechte/services/airports/getAirportNameByIataCode");
vi.mock(
  "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports",
);
vi.mock("../../../addNewPageInCaseMissingVerticalSpace");

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

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("addDistanceInfo", () => {
  it("should have the text distance airport", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.Enum.no,
    };

    addDistanceInfo(mockDoc, userDataWeiterePersonenMock);

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

    addDistanceInfo(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Distanz zwischen ${startAirportMock} und ${endAirportMock} beträgt nach Großkreismethode ca. ${distanceValueMock} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationValueMock} € pro Person, insgesamt aus eigenem und abgetretenem Recht damit eine Gesamtsumme von ${compensationValueMock} €.`,
      PDF_MARGIN_HORIZONTAL,
      undefined,
    );
  });

  it("should call addNewPageInCaseMissingVerticalSpace", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDistanceInfo(mockDoc, userDataMock);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalled();
  });
});
