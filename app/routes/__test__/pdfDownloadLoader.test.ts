import type { LoaderFunctionArgs } from "@remix-run/node";
import { PDFDocument } from "pdf-lib";
import { pdfDownloadLoader } from "../shared/pdfDownloadLoader";

// Convert Buffers to Uint8Array for compatibility with Vitest
// Vitest expects Uint8Array inputs for certain methods in pdf-lib.
function wrapPdfDocumentLoad() {
  const originalLoad = PDFDocument.load;
  vi.spyOn(PDFDocument, "load").mockImplementation((input, ...args) => {
    const adjustedInput =
      input instanceof Buffer ? new Uint8Array(input) : input;
    return originalLoad.call(PDFDocument, adjustedInput, ...args);
  });
}

function wrapEmbedFont() {
  const originalEmbedFont = PDFDocument.prototype.embedFont;
  vi.spyOn(PDFDocument.prototype, "embedFont").mockImplementation(function (
    this: PDFDocument,
    fontData,
    ...args
  ) {
    const adjustedFontData =
      fontData instanceof Buffer ? new Uint8Array(fontData) : fontData;
    return originalEmbedFont.call(this, adjustedFontData, ...args);
  });
}

vi.mock("~/services/flow/pruner", () => ({
  pruneIrrelevantData: vi
    .fn()
    .mockResolvedValue({ vorname: "Zoe", nachname: "Müller" }),
}));

beforeAll(() => {
  wrapPdfDocumentLoad();
  wrapEmbedFont();
});

describe("pdfDownloadLoader", () => {
  it("generates correct PDF for Beratungshilfe", async () => {
    const mockLoaderArgs: LoaderFunctionArgs = {
      request: new Request(
        "https://mock-url.de/beratungshilfe/antrag/download/pdf",
        {
          method: "GET",
          headers: new Headers({ Cookie: "mock-session-data" }),
        },
      ),
      params: {},
      context: {},
    };

    const response = await pdfDownloadLoader(mockLoaderArgs);
    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
    const nameField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(4);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });

  it("generates correct PDF for Prozesskostenhilfe", async () => {
    const mockLoaderArgs: LoaderFunctionArgs = {
      request: new Request(
        "https://mock-url.de/prozesskostenhilfe/formular/download/pdf",
        {
          method: "GET",
          headers: new Headers({ Cookie: "mock-session-data" }),
        },
      ),
      params: {},
      context: {},
    };

    const response = await pdfDownloadLoader(mockLoaderArgs);
    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(new Uint8Array(pdfBuffer));
    const nameField = pdfDoc
      .getForm()
      .getTextField("Name Vorname ggf Geburtsname");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(9);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });
});
