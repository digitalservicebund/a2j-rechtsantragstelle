import type PDFDocument from "pdfkit";

export const createLocalCourt = (doc: typeof PDFDocument) => {
  const myStruct = doc.struct("P");
  doc.addStructure(myStruct);
  const myStructContent = doc.markStructureContent("P");
  doc.fontSize(10).font("BundesSansWebBold").text("An das", { align: "left" });
  doc
    .font("BundesSansWebRegular")
    .text("Amtsgericht Königs Wusterhausen", { align: "left" });
  doc.text("Schlossplatz 4", { align: "left" });
  doc.text("15711 Königs Wusterhausen", { align: "left" });
  doc.endMarkedContent();
  myStruct.add(myStructContent);
  myStruct.end();
};
