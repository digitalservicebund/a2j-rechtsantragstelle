import { PDFDocument } from "pdf-lib";
import { loader } from "../pdfDownloadLoader";
import { mockRouteArgsFromRequest } from "~/routes/__test__/mockRouteArgsFromRequest";

vi.mock("~/services/flow/pruner/pruner", () => ({
  pruneIrrelevantData: vi.fn().mockResolvedValue({
    prunedData: { vorname: "Zoe", nachname: "Müller" },
  }),
}));

vi.mock("~/services/cms/index.server.ts", () => ({
  fetchTranslations: vi.fn().mockResolvedValue({}),
}));

describe("pdfDownloadLoader", () => {
  it("generates correct PDF for Beratungshilfe", async () => {
    const url = "https://mock-url.de/beratungshilfe/antrag/download/pdf";
    const response = await loader(mockRouteArgsFromRequest(new Request(url)));

    const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
    const nameField = pdfDoc
      .getForm()
      .getTextField("Antragsteller (Name, Vorname ggf Geburtsname)");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(5);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });

  it("generates correct PDF for Prozesskostenhilfe", async () => {
    const url = "https://mock-url.de/prozesskostenhilfe/formular/download/pdf";
    const response = await loader(mockRouteArgsFromRequest(new Request(url)));

    const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
    const nameField = pdfDoc
      .getForm()
      .getTextField("Name, Vorname, ggf. Geburtsname");

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(pdfDoc.getPageCount()).toBe(10);
    expect(nameField.getText()).toBe("Müller, Zoe");
  });
});
