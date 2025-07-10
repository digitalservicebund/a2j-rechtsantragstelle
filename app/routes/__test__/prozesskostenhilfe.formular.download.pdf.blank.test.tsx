import { PDFDocument } from "pdf-lib";
import { loader } from "~/routes/prozesskostenhilfe.formular.download.pdf.blank";

describe("Prozesskostenhilfe Blank Formular Download", () => {
  it("should return a PDF response to the browser", async () => {
    const response = await loader();
    expect(response.ok).toBe(true);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
    expect(pdfDoc.getPageCount()).toBe(4);
  });
});
