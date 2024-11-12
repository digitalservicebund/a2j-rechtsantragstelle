import { Result } from "true-myth";
import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";
import {
  addCompensationAmount,
  ARTICLE_AIR_PASSENGER_REGULATION_TEXT,
  DEMANDED_COMPENSATION_PAYMENT_TEXT,
  OTHER_DETAILS_ITINERARY,
  OTHER_PASSENGERS_DEMANDED_COMPENSATION_PAYMENT_TEXT,
  PLAINTIFF_WITNESSES_TEXT,
} from "../addCompensationAmount";

vi.mock("~/services/airports/getCompensationPayment");
vi.mock("~/services/airports/getAirportNameByIataCode");
vi.mock("~/services/airports/calculateDistanceBetweenAirports");
vi.mock("../../addNewPageInCaseMissingVerticalSpace");

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

describe("addCompensationAmount", () => {
  it("should have the text for other details itinerary in case the zusaetzlicheAngaben is defined ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addCompensationAmount(mockDoc, mockStruct, userDataMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      PDF_MARGIN_HORIZONTAL,
      expect.anything(),
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.zusaetzlicheAngaben);
  });

  it("should not have the text for other details itinerary in case zusaetzlicheAngaben is not defined", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWithoutZusaetzlicheAngaben = {
      ...userDataMock,
      zusaetzlicheAngaben: undefined,
    };

    addCompensationAmount(
      mockDoc,
      mockStruct,
      userDataWithoutZusaetzlicheAngaben,
      0,
    );

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      PDF_MARGIN_HORIZONTAL,
      expect.anything(),
    );

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      userDataMock.zusaetzlicheAngaben,
      PDF_MARGIN_HORIZONTAL,
      expect.anything(),
    );
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
      isWeiterePersonen: YesNoAnswer.Enum.yes,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataWeiterePersonenMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Distanz zwischen ${startAirportMock} und ${endAirportMock} beträgt nach Großkreismethode ca. ${distanceValueMock} km. ${ARTICLE_AIR_PASSENGER_REGULATION_TEXT} ${compensationValueMock} €.`,
      PDF_MARGIN_HORIZONTAL,
      undefined,
    );
  });

  it("should have the text for plaintiff witnesses in case the hasZeugen is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataHasZeugenMock, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_WITNESSES_TEXT);
  });

  it("should not have the text for plaintiff witnesses in case the hasZeugen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataHasZeugenMock, 0);

    expect(mockDoc.text).not.toHaveBeenCalledWith(PLAINTIFF_WITNESSES_TEXT);
  });

  it("should call addNewPageInCaseMissingVerticalSpace three times in case the hasZeugen is yes ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.yes,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataHasZeugenMock, 0);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(3);
  });

  it("should call addNewPageInCaseMissingVerticalSpace two times in case the hasZeugen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataHasZeugenMock = {
      ...userDataMock,
      hasZeugen: YesNoAnswer.Enum.no,
    };

    addCompensationAmount(mockDoc, mockStruct, userDataHasZeugenMock, 0);

    expect(addNewPageInCaseMissingVerticalSpace).toBeCalledTimes(2);
  });
});
