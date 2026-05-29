import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

const TITLE_WITH_KIDS = "IV. Anmerkungen für das Gericht";
const TITLE_WITHOUT_KIDS = "III. Anmerkungen für das Gericht";

export const createNoteForJudge = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: NachlassErbausschlagungAnfrageUserData,
) => {
  if (!objectKeysNonEmpty(userData, ["weitereInformationen"])) {
    return;
  }

  addNewPageInCaseMissingVerticalSpace(doc);

  const noteForJudgeSection = doc.struct("Sect");

  noteForJudgeSection.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          userData.hasKid === "yes" ? TITLE_WITH_KIDS : TITLE_WITHOUT_KIDS,
          {
            align: "left",
          },
        )
        .fontSize(10)
        .moveDown(1);
    }),
  );

  noteForJudgeSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(userData.weitereInformationen ?? "");
    }),
  );

  documentStruct.add(noteForJudgeSection);
};
