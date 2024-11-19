import { PageSizes, PDFDocument } from "pdf-lib";
import { appendPagesToPdf } from "../appendPagesToPdf";

async function createPdfWithUniqueSize(
  pageSize: (typeof PageSizes)[keyof typeof PageSizes],
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage(pageSize);

  return pdfDoc.save();
}

describe("appendPagesToPdf", () => {
  it("should merge two PDFs and maintain all pages", async () => {
    const primaryPdfBytes = await createPdfWithUniqueSize(PageSizes.A4);
    const secondaryPdfBytes = await createPdfWithUniqueSize(PageSizes.A5);

    const primaryPdf = await PDFDocument.load(primaryPdfBytes);
    const secondaryPdf = await PDFDocument.load(secondaryPdfBytes);

    const mergedPdfBytes = await appendPagesToPdf(primaryPdf, secondaryPdf);

    const mergedPdf = await PDFDocument.load(mergedPdfBytes);

    expect(mergedPdf.getPageCount()).toBe(2);

    const page1 = mergedPdf.getPage(0);
    expect(page1.getWidth()).toBe(595.28);
    expect(page1.getHeight()).toBe(841.89);

    const page2 = mergedPdf.getPage(1);
    expect(page2.getWidth()).toBe(419.53);
    expect(page2.getHeight()).toBe(595.28);
  });
});
