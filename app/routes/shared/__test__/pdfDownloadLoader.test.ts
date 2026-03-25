import { PDFDocument } from "pdf-lib";
import { fluggastrechtePdfFromUserdata } from "~/domains/fluggastrechte/services/pdf/fluggastrechtePdfFromUserdata";
import { loader } from "../pdfDownloadLoader";
import { mockRouteArgsFromRequest } from "~/routes/__test__/mockRouteArgsFromRequest";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

vi.mock("~/services/flow/pruner/pruner", () => ({
  pruneIrrelevantData: vi.fn().mockReturnValue({
    prunedData: { vorname: "Zoe", nachname: "Müller" },
  }),
}));

vi.mock("~/services/cms/index.server.ts", () => ({
  fetchTranslations: vi.fn().mockResolvedValue({}),
}));

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(),
}));

vi.mock(
  "~/domains/fluggastrechte/services/pdf/fluggastrechtePdfFromUserdata",
  () => ({
    fluggastrechtePdfFromUserdata: vi.fn(),
  }),
);

describe("pdfDownloadLoader", () => {
  beforeEach(() => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(false);
  });

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

  it.each([true, false])(
    "passes showFGROnlineVerfahren feature flag to fluggastrechte PDF generator (%s)",
    async (flagEnabled) => {
      vi.mocked(isFeatureFlagEnabled).mockResolvedValue(flagEnabled);
      vi.mocked(fluggastrechtePdfFromUserdata).mockResolvedValue(
        Buffer.from([1, 2, 3]),
      );

      const url = "https://mock-url.de/fluggastrechte/formular/download/pdf";
      const response = await loader(mockRouteArgsFromRequest(new Request(url)));

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("application/pdf");
      expect(isFeatureFlagEnabled).toHaveBeenCalledWith(
        "showFGROnlineVerfahren",
      );
      expect(fluggastrechtePdfFromUserdata).toHaveBeenCalledWith(
        expect.objectContaining({ vorname: "Zoe", nachname: "Müller" }),
        {
          showFGROnlineVerfahren: flagEnabled,
        },
      );
    },
  );
});
