export const getHeightOfString = (
  text: string | string[],
  doc: PDFKit.PDFDocument,
  width: number,
): number => {
  if (typeof text === "string") {
    return doc.heightOfString(text, { width });
  }

  let totalHeight = 0;
  for (const part of text) {
    totalHeight += doc.heightOfString(part, { width });
  }

  return totalHeight;
};
