import type { PDFDocument, PDFPage } from "pdf-lib";

// DinA4 in pixel at 72 ppi
const dinA4Width = 595;
const dinA4Height = 842;

function xyTranslationsForA4(page: PDFPage) {
  return {
    translateX: (dinA4Width - page.getWidth()) / 2,
    translateY: (dinA4Height - page.getHeight()) / 2,
  };
}
export function resizeToA4(pdfDoc: PDFDocument) {
  const fields = pdfDoc.getForm().getFields();
  const pages = pdfDoc.getPages();

  // Fields are not moved using translateContent, see https://github.com/Hopding/pdf-lib/issues/1348
  fields.forEach((field) => {
    field.acroField.getWidgets().forEach((widget) => {
      // We need to find its parent page, see https://github.com/Hopding/pdf-lib/issues/1090#issuecomment-970910486
      const page = pages.find((p) => p.ref === widget.P());
      const { translateX, translateY } = xyTranslationsForA4(page!);
      const rect = widget.getRectangle();
      rect.x += translateX;
      rect.y += translateY;
      widget.setRectangle(rect);
    });
  });

  pages.forEach((page) => {
    const { translateX, translateY } = xyTranslationsForA4(page);
    page.setSize(dinA4Width, dinA4Height);
    page.translateContent(translateX, translateY);
    page.resetPosition();
  });
}
