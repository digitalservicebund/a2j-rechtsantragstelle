import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { styles } from "~/services/pdf/attachment/styles";
import { FONTS_BUNDESSANS_REGULAR } from "~/services/pdf/createPdfKitDocument";

export const createChecklistHeader = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userdata: BeratungshilfeFormularContext,
) => {
  const checklistHeaderSect = doc.struct("Sect");

  checklistHeaderSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(styles.pageHeader.fontSize)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `Merkblatt: Antrag auf Bewilligung von Beratungshilfe von ${userdata.vorname} ${userdata.nachname}`,
        );
    }),
  );

  documentStruct.add(checklistHeaderSect);
};
