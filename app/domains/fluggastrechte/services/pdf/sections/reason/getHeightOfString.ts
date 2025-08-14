import type PDFDocument from "pdfkit";

export const getHeightOfString = (
  text: string | string[],
  doc: typeof PDFDocument,
  width: number,
): number => {
  if (typeof text === "string") {
    return doc.heightOfString(text, { width });
  }

  return text.reduce(
    (acc, part) => acc + doc.heightOfString(part, { width }),
    0,
  );
};
