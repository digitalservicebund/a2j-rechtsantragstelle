import type PDFDocument from "pdfkit";
import { pdfStyles } from "../../domains/shared/pdf/pdfStyles";

export function createHeading(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  heading: string,
  level: "H1" | "H2" | "H3" | "H4" | "H5" | "H6",
) {
  const levelStyle = pdfStyles[level.toLowerCase() as keyof typeof pdfStyles];

  documentStruct.add(
    doc.struct(level, {}, () => {
      doc
        .fontSize(
          "fontSize" in levelStyle
            ? levelStyle.fontSize
            : pdfStyles.page.fontSize,
        )
        .font("font" in levelStyle ? levelStyle.font : pdfStyles.page.font)
        .text(heading)
        .moveDown(1);
    }),
  );
}
