import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type * as CreatePdfKitDocumentModule from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { erbscheinAnfragePdfFromUserdata } from "~/domains/nachlass/services/pdf/erbschein/erbscheinAnfragePdfFromUserdata";

const mockDocumentStructure = mockPdfKitDocumentStructure();

const mockDoc = mockPdfKitDocument(mockDocumentStructure);

vi.mock("~/services/pdf/createPdfKitDocument", async (importOriginal) => {
  const actual = await importOriginal<typeof CreatePdfKitDocumentModule>();

  return {
    ...actual,
    createPdfKitDocument: () => mockDoc,
  };
});

const userDataMock = {
  verstorbeneFamilienstand: "ledig",
  verstorbeneVorname: "Max",
  testamentArt: "handwritten",
} satisfies NachlassErbscheinAnfrageUserData;

describe("erbscheinAnfragePdfFromUserdata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should skip the Ehepartner section if the Erblasser was single", () => {
    erbscheinAnfragePdfFromUserdata(userDataMock);
    expect(mockDoc.text).toHaveBeenCalledWith("Max");
    expect(mockDoc.text).not.toHaveBeenCalledWith(
      "Letzter Ehepartner oder letzte Ehepartnerin",
      {
        align: "left",
      },
    );
  });

  it("should skip the Angehörige section if the Erblasser had any kind of testament", () => {
    erbscheinAnfragePdfFromUserdata(userDataMock);
    expect(mockDoc.text).toHaveBeenCalledWith("Max");
    expect(mockDoc.text).not.toHaveBeenCalledWith("Angehörige", {
      align: "left",
    });
  });
});
