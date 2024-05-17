import { PDFDocument } from "pdf-lib";

export async function deepClone(pdfDoc: PDFDocument) {
  // .copy() doesn't process form fields, they need to be copied and registered manually.
  // See https://github.com/Hopding/pdf-lib/issues/417#issuecomment-739062355
  const newDoc = await pdfDoc.copy();
  pdfDoc
    .getForm()
    .getFields()
    .forEach((field) => {
      const newRef = newDoc.context.register(field.acroField.dict);
      newDoc.getForm().acroForm.addField(newRef);
    });
  return newDoc;
}
