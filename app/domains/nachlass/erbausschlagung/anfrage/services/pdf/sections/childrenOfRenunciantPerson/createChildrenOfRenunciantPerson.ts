import type PDFDocument from "pdfkit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addChildOfRenunciantPersonDetails } from "./addChildOfRenunciantPersonDetails";
import { addChildOfRenunciantPersonAddress } from "./addChildOfRenunciantPersonAddress";
import { addChildOfRenunciantPersonCustodyDetails } from "./addChildOfRenunciantPersonCustodyDetails";
import { toDate } from "~/services/validation/dateObject";
import { addYears, today } from "~/util/date";

const TITLE = "III. Kinder der ausschlagenden Person";
const getSubtitle = (index: number) => `Kind ${index + 1}`;
const RENUNCIANT_CHILD_TEXT =
  "Das Erbe soll auch für das Kind ausgeschlagen werden: ";

const isChildUnder18YearsOld = (child: NachlassErbausschlagungAnfrageKind) => {
  if (!child.geburtsdatum) {
    return false;
  }
  const birthDate = toDate(child.geburtsdatum);
  if (Number.isNaN(birthDate.getTime())) return false;

  const eighteenYearsAgo = addYears(today(), -18);

  return birthDate > eighteenYearsAgo;
};

export type NachlassErbausschlagungAnfrageKind = Exclude<
  NachlassErbausschlagungAnfrageUserData["kinder"],
  undefined
>[number];

export const createChildrenOfRenunciantPerson = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  { hasKid, kinder }: NachlassErbausschlagungAnfrageUserData,
) => {
  if (hasKid === "no" || !kinder || kinder.length === 0) {
    return;
  }
  const childrenOfRenunciantPersonSection = doc.struct("Sect");

  childrenOfRenunciantPersonSection.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(TITLE, {
          align: "left",
        })
        .fontSize(10)
        .moveDown(1);
    }),
  );

  for (const [index, kind] of kinder.entries()) {
    childrenOfRenunciantPersonSection.add(
      doc.struct("H3", {}, () => {
        if (doc.y > PDF_HEIGHT_SEIZE - 150) {
          doc.addPage();
        }

        doc
          .fontSize(12)
          .text(getSubtitle(index), {
            align: "left",
          })
          .fontSize(10)
          .moveDown();
      }),
    );

    addChildOfRenunciantPersonDetails(
      doc,
      childrenOfRenunciantPersonSection,
      kind,
    );

    addChildOfRenunciantPersonAddress(
      doc,
      childrenOfRenunciantPersonSection,
      kind,
    );

    if (isChildUnder18YearsOld(kind)) {
      addChildOfRenunciantPersonCustodyDetails(
        doc,
        childrenOfRenunciantPersonSection,
        kind,
      );
    }

    if (kind.hasRenouncedInheritance !== undefined) {
      childrenOfRenunciantPersonSection.add(
        doc.struct("P", {}, () => {
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_REGULAR)
            .text(RENUNCIANT_CHILD_TEXT, {
              continued: true,
            })
            .font(FONTS_BUNDESSANS_BOLD)
            .text(kind.hasRenouncedInheritance === "yes" ? "Ja" : "Nein")
            .moveDown();
        }),
      );
    }
  }

  documentStruct.add(childrenOfRenunciantPersonSection);
};
