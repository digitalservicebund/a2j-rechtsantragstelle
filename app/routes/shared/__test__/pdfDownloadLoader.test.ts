import { PDFDocument } from "pdf-lib";
import { pdfDownloadLoader } from "../pdfDownloadLoader";

vi.mock("~/services/flow/pruner", () => ({
  pruneIrrelevantData: vi
    .fn()
    .mockResolvedValue({ pruneData: { vorname: "Zoe", nachname: "Müller" } }),
}));

vi.mock("~/services/cms/index.server.ts", () => ({
  fetchTranslations: vi.fn().mockResolvedValue({}),
}));

describe("pdfDownloadLoader", () => {
  it("generates correct PDF for Beratungshilfe", async () => {
    const response = await pdfDownloadLoader({
      request: new Request(
        "https://mock-url.de/beratungshilfe/antrag/download/pdf",
      ),
      params: {},
      context: {},
    });

    const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
    const nameField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(4);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });

  it("generates correct PDF for Prozesskostenhilfe", async () => {
    const response = await pdfDownloadLoader({
      request: new Request(
        "https://mock-url.de/prozesskostenhilfe/formular/download/pdf",
      ),
      params: {},
      context: {},
    });

    const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
    const nameField = pdfDoc
      .getForm()
      .getTextField("Name Vorname ggf Geburtsname");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(9);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });
});
