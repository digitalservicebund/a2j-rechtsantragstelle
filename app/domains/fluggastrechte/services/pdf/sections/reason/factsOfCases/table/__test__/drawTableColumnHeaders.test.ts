import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { addAttributeToTableCell } from "../addAttributeToTableCell";
import { drawTableColumnHeaders } from "../drawTableColumnHeaders";
import { drawTextCell } from "../drawTextCell";
import {
  COLUMN_HEIGHT,
  COLUMN_WIDTH,
  START_TABLE_X,
} from "../tableConfigurations";

vi.mock("../addAttributeToTableCell");
vi.mock("../drawTextCell");

vi.mocked(addAttributeToTableCell).mockImplementation(() => vi.fn());
vi.mocked(drawTextCell).mockImplementation(() => vi.fn());

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

describe("drawTableColumnHeaderRow", () => {
  it("should call drawTextCell three times", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnHeaders(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toBeCalledTimes(3);
  });

  it("should print the cell about planned time", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnHeaders(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 1,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Geplante Zeiten",
      "laut Ticket",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about actual time given no replacement", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataTatsaechlicherFlugYesMock = {
      ...userDataMock,
      tatsaechlicherFlug: "yes",
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(
      mockDoc,
      mockStruct,
      0,
      userDataTatsaechlicherFlugYesMock,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 2,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Tatsächliche Zeiten",
      "gleicher Flug",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about actual time given replacement flight to another flight", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtFlugMock = {
      ...userDataMock,
      ersatzverbindungArt: "flug",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtFlugMock,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 2,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Tatsächliche Zeiten",
      "anderer Flug",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about actual time given replacement to another transportation", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtEtwasAnderesMock = {
      ...userDataMock,
      ersatzverbindungArt: "etwasAnderes",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtEtwasAnderesMock,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 2,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Tatsächliche Zeiten",
      "Bahn, Bus o.ä.",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about actual time given replacement to not come", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataErsatzverbindungArtKeinAnkunftMock = {
      ...userDataMock,
      ersatzverbindungArt: "keineAnkunft",
      tatsaechlicherFlug: "no",
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(
      mockDoc,
      mockStruct,
      0,
      userDataErsatzverbindungArtKeinAnkunftMock,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 2,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Tatsächliche Zeiten",
      "gar nicht angekommen",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about Verspätung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnHeaders(mockDoc, mockStruct, 0, userDataMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 3,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Verspätung",
      "",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about Annullierung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataAnnullierungMock = {
      ...userDataMock,
      bereich: "annullierung",
      ersatzverbindungArt: undefined,
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(mockDoc, mockStruct, 0, userDataAnnullierungMock);

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 3,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Annullierung",
      "",
      true,
      "center",
      10,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 2,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Angebotene Ersatzverbindung",
      "",
      true,
      "center",
      10,
    );
  });

  it("should print the cell about Nicht-Beförderung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtbefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
    } satisfies FluggastrechteUserData;

    drawTableColumnHeaders(
      mockDoc,
      mockStruct,
      0,
      userDataNichtbefoerderungMock,
    );

    expect(drawTextCell).toHaveBeenCalledWith(
      mockDoc,
      START_TABLE_X + COLUMN_WIDTH * 3,
      0,
      COLUMN_WIDTH,
      COLUMN_HEIGHT,
      "Nicht-Beförderung",
      "",
      true,
      "center",
      10,
    );
  });

  it("should add TH cells with Scope='Row'", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    drawTableColumnHeaders(mockDoc, mockStruct, 0, userDataMock);

    const callsWithTH = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "TH",
    );
    expect(callsWithTH).toHaveLength(3);
    expect(addAttributeToTableCell).toHaveBeenCalledWith(
      mockDoc,
      expect.any(Object),
      expect.objectContaining({ Scope: "Row" }),
    );
  });
});
