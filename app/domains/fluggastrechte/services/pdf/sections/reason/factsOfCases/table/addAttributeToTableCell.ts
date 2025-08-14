export const addAttributeToTableCell = (
  doc: PDFKit.PDFDocument,
  cell: PDFKit.PDFStructureElement,
  attributes: Record<string, number | string>,
): void => {
  const attrRef = doc.ref({
    O: "Table",
    ...attributes,
  });
  // Add accessibility attributes to the table cell
  // @ts-expect-error: PDFKit does not have type definitions for structure elements
  cell.dictionary.data.A = attrRef;
  // @ts-expect-error: PDFKit does not have type definitions for structure elements
  cell.dictionary.data.A.end();
};
