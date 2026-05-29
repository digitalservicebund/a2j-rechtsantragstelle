import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbausschlagungAnfrageKind } from "./createChildrenOfRenunciantPerson";

const getCustodyText = (
  optionSorgerecht: NachlassErbausschlagungAnfrageKind["optionSorgerecht"],
) => {
  switch (optionSorgerecht) {
    case "anotherOrganization":
      return "Sorgerecht liegt bei einer Organisation";
    case "anotherPerson":
      return "Sorgerecht liegt bei einer anderen Person";
    case "shared":
      return "Ausschlagende Person teilt sich das Sorgerecht mit einer anderen Person";
    case "yes":
      return "Ausschlagende Person ist allein sorgeberechtigt";
    default:
      return "";
  }
};

const addCustodyOrganizationDetails = (
  doc: typeof PDFDocument,
  childOfRenunciantPersonSection: PDFKit.PDFStructureElement,
  {
    organizationNameSorgerecht,
    organizationAdressZusatzSorgerecht,
    organizationStrasseSorgerecht,
    organizationHausnummerSorgerecht,
    organizationPlzSorgerecht,
    organizationOrtSorgerecht,
  }: NachlassErbausschlagungAnfrageKind,
) => {
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Name der Organisation mit dem Sorgerecht: ", {
      continued: true,
    })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(organizationNameSorgerecht ?? "")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Anschrift der Organisation mit dem Sorgerecht:")
    .font(FONTS_BUNDESSANS_BOLD);

  if (organizationAdressZusatzSorgerecht) {
    doc.text(organizationAdressZusatzSorgerecht);
  }

  doc
    .text(
      `${organizationStrasseSorgerecht ?? ""} ${organizationHausnummerSorgerecht ?? ""}`,
    )
    .text(
      `${organizationPlzSorgerecht ?? ""} ${organizationOrtSorgerecht ?? ""}`,
    );
};

export const addChildOfRenunciantPersonCustodyDetails = (
  doc: typeof PDFDocument,
  childOfRenunciantPersonSection: PDFKit.PDFStructureElement,
  kind: NachlassErbausschlagungAnfrageKind,
) => {
  childOfRenunciantPersonSection.add(
    doc.struct("Span", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Sorgerecht: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(getCustodyText(kind.optionSorgerecht));

      if (kind.optionSorgerecht === "anotherOrganization") {
        addCustodyOrganizationDetails(
          doc,
          childOfRenunciantPersonSection,
          kind,
        );
      }

      doc.moveDown();
    }),
  );
};
