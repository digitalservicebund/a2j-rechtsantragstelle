import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { drawCell } from "../drawCell";
import { drawTableRowHead } from "../drawTableRowHead";
import { COLUMN_HEIGHT, COLUMN_WIDTH } from "../tableConfigurations";

vi.mock("../drawCell");

vi.mocked(drawCell).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("drawTableRowHead", () => {
  it("should call drawCell three times", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRowHead(mockDoc, mockStruct, 0, userDataMock);

    expect(drawCell).toBeCalledTimes(3);
  });

  it("should call drawCell to print the cell about planned time", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRowHead(mockDoc, mockStruct, 0, userDataMock);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Geplante Zeiten",
      regularText: "laut Ticket",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about actual time given no replacement", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataTatsaechlicherFlugYesMock = {
      ...userDataMock,
      tatsaechlicherFlug: "yes",
    } satisfies FluggastrechtContext;

    drawTableRowHead(mockDoc, mockStruct, 0, userDataTatsaechlicherFlugYesMock);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Tatsächliche Zeiten",
      regularText: "gleicher Flug",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about actual time given replacement flight to another flight", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtFlugMock = {
      ...userDataMock,
      ersatzverbindungArt: "flug",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechtContext;

    drawTableRowHead(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtFlugMock,
    );

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Tatsächliche Zeiten",
      regularText: "anderer Flug",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about actual time given replacement flight to another transportation", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtEtwasAnderesMock = {
      ...userDataMock,
      ersatzverbindungArt: "etwasAnderes",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechtContext;

    drawTableRowHead(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtEtwasAnderesMock,
    );

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Tatsächliche Zeiten",
      regularText: "Bahn, Bus o.ä.",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about actual time given replacement flight to not come", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtKeinAnkunftMock = {
      ...userDataMock,
      ersatzverbindungArt: "keineAnkunft",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechtContext;

    drawTableRowHead(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtKeinAnkunftMock,
    );

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Tatsächliche Zeiten",
      regularText: "gar nicht angekommen",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about Verspätung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableRowHead(mockDoc, mockStruct, 0, userDataMock);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Verspätung",
      regularText: "",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about Annullierung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataAnnullierungMock = {
      ...userDataMock,
      bereich: "annullierung",
      ersatzverbindungArt: undefined,
    } satisfies FluggastrechtContext;

    drawTableRowHead(mockDoc, mockStruct, 0, userDataAnnullierungMock);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Annullierung",
      regularText: "",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Angebotene Ersatzverbindung",
      regularText: "",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });

  it("should call drawCell to print the cell about Nicht-Beförderung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtbefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
    } satisfies FluggastrechtContext;

    drawTableRowHead(mockDoc, mockStruct, 0, userDataNichtbefoerderungMock);

    expect(drawCell).toBeCalledWith(mockDoc, {
      xPosition: expect.anything(),
      yPosition: expect.anything(),
      width: COLUMN_WIDTH,
      height: COLUMN_HEIGHT,
      boldText: "Nicht-Beförderung",
      regularText: "",
      shouldAddSilverBackground: true,
      textAlign: "center",
    });
  });
});
