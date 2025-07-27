import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  addFlightTextArea,
  REASON_CANCEL_FLIGHT_LOST_CONNECTION,
  REASON_DELAY_FLIGHT_LOST_CONNECTION,
  REASON_NON_TRANSPORTE_FLIGHT_LOST_CONNECTION,
} from "../addFlightTextArea";
import { getStartAndEndAirportDelayNames } from "../getStartAndEndAirportDelayNames";

vi.mock("../getStartAndEndAirportDelayNames");

const startAirportMock = "BERLIN";
const endAirportMock = "NEW YORK";

vi.mocked(getStartAndEndAirportDelayNames).mockReturnValue({
  startAirportName: startAirportMock,
  endAirportName: endAirportMock,
});

afterAll(() => {
  vi.clearAllMocks();
});

describe("addFlightTextArea", () => {
  it("should not have any text given zwischenstoppAnzahl as no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    addFlightTextArea(mockDoc, userDataMock, mockSect);

    expect(mockDoc.text).not.toBeCalled();
  });

  it("should have the text for start and end airport for verspaetet bereich and anschlussFlugVerpasst no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataVerspaetetMock = {
      ...userDataMock,
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.no,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataVerspaetetMock, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} hatte die genannte Verspätung.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for verspaetet bereich and anschlussFlugVerpasst yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataVerspaetetMock = {
      ...userDataMock,
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.yes,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataVerspaetetMock, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} hatte die genannte Verspätung. ${REASON_DELAY_FLIGHT_LOST_CONNECTION}`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for annullierung bereich and anschlussFlugVerpasst no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataAnnullierung = {
      ...userDataMock,
      bereich: "annullierung",
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.no,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataAnnullierung, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} wurde annulliert.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for annullierung bereich and anschlussFlugVerpasst yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataAnnullierung = {
      ...userDataMock,
      bereich: "annullierung",
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.yes,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataAnnullierung, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} wurde annulliert. ${REASON_CANCEL_FLIGHT_LOST_CONNECTION}`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for nichtbefoerderung bereich and anschlussFlugVerpasst no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.no,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataNichtBefoerderungMock, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Nicht-Beförderung fand auf dem Flug von ${startAirportMock} nach ${endAirportMock} statt.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for nichtbefoerderung bereich and anschlussFlugVerpasst yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
      zwischenstoppAnzahl: "oneStop",
      anschlussFlugVerpasst: YesNoAnswer.Enum.yes,
    } satisfies FluggastrechteUserData;

    addFlightTextArea(mockDoc, userDataNichtBefoerderungMock, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Nicht-Beförderung fand auf dem Flug von ${startAirportMock} nach ${endAirportMock} statt. ${REASON_NON_TRANSPORTE_FLIGHT_LOST_CONNECTION}`,
      PDF_MARGIN_HORIZONTAL,
    );
  });
});
