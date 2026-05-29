import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import { type NachlassErbausschlagungAnfrageKind } from "./createChildrenOfRenunciantPerson";

const NAME_ORGANIZATION_CUSTODY_TEXT =
  "Name der Organisation mit dem Sorgerecht: ";
const ADDRESS_ORGANIZATION_CUSTODY_TEXT =
  "Anschrift der Organisation mit dem Sorgerecht:";
const NAME_PERSON_SHARED_CUSTODY_TEXT =
  "Name der weiteren Person mit dem Sorgerecht: ";
const ADDRESS_PERSON_SHARED_CUSTODY_TEXT =
  "Anschrift der weiteren Person mit dem Sorgerecht: ";
const NAME_PERSON_ANOTHER_PERSON_CUSTODY_TEXT =
  "Name der Person mit dem Sorgerecht: ";
const ADDRESS_PERSON_ANOTHER_PERSON_CUSTODY_TEXT =
  "Anschrift der Person mit dem Sorgerecht: ";

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

const addCustodySharedOrAnotherPersonDetails = (
  doc: typeof PDFDocument,
  {
    strasseSorgerecht,
    hausnummerSorgerecht,
    plzSorgerecht,
    ortSorgerecht,
    adresseZusatzSorgerecht,
    nachnameSorgerecht,
    vornameSorgerecht,
    optionSorgerecht,
    hasSorgerechtSameAddress,
  }: NachlassErbausschlagungAnfrageKind,
) => {
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(
      optionSorgerecht === "shared"
        ? NAME_PERSON_SHARED_CUSTODY_TEXT
        : NAME_PERSON_ANOTHER_PERSON_CUSTODY_TEXT,
      {
        continued: true,
      },
    )
    .font(FONTS_BUNDESSANS_BOLD)
    .text(`${vornameSorgerecht ?? ""} ${nachnameSorgerecht ?? ""}`)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(
      optionSorgerecht === "shared"
        ? ADDRESS_PERSON_SHARED_CUSTODY_TEXT
        : ADDRESS_PERSON_ANOTHER_PERSON_CUSTODY_TEXT,
    )
    .font(FONTS_BUNDESSANS_BOLD);

  if (hasSorgerechtSameAddress === "yes") {
    doc.text("Wohnt zusammen mit der ausschlagenden Person");
    return;
  }

  if (adresseZusatzSorgerecht) {
    doc.text(adresseZusatzSorgerecht);
  }

  doc
    .text(`${strasseSorgerecht ?? ""} ${hausnummerSorgerecht ?? ""}`)
    .text(`${plzSorgerecht ?? ""} ${ortSorgerecht ?? ""}`);
};

const addCustodyOrganizationDetails = (
  doc: typeof PDFDocument,
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
    .text(NAME_ORGANIZATION_CUSTODY_TEXT, {
      continued: true,
    })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(organizationNameSorgerecht ?? "")
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(ADDRESS_ORGANIZATION_CUSTODY_TEXT)
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
  childrenOfRenunciantPersonSection: PDFKit.PDFStructureElement,
  kind: NachlassErbausschlagungAnfrageKind,
) => {
  childrenOfRenunciantPersonSection.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Sorgerecht: ", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(getCustodyText(kind.optionSorgerecht));

      if (kind.optionSorgerecht === "anotherOrganization") {
        addCustodyOrganizationDetails(doc, kind);
      }

      if (
        kind.optionSorgerecht === "anotherPerson" ||
        kind.optionSorgerecht === "shared"
      ) {
        addCustodySharedOrAnotherPersonDetails(doc, kind);
      }

      doc.moveDown();
    }),
  );
};
