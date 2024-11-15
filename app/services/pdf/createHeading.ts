import type PDFDocument from "pdfkit";
import { styles } from "./attachment/styles";
import { FONTS_BUNDESSANS_BOLD } from "./createPdfKitDocument";

export function createHeading(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  heading: string,
  level: "H1" | "H2" | "H3" | "H4" | "H5" | "H6",
) {
  const levelStyle = styles[level.toLowerCase() as keyof typeof styles];

  documentStruct.add(
    doc.struct(level, {}, () => {
      doc
        .fontSize(levelStyle.fontSize)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(heading);
    }),
  );
}
