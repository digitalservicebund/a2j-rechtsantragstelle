export const addAttributeToTableCell = (
  doc: PDFKit.PDFDocument,
  cell: PDFKit.PDFStructureElement,
  attributes: Record<string, number | string | boolean>,
) => {
  // @ts-expect-error - PDFKit does not have type definitions for structure elements
  cell.dictionary.data.A = doc.ref({
    O: "Table",
    ...attributes,
  });
  // @ts-expect-error - PDFKit does not have type definitions for structure elements
  cell.dictionary.data.A.end();
};
