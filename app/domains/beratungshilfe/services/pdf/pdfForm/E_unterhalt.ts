import {
  addSupportRecipientsToAttachment,
  familyRelationshipMap,
} from "~/domains/shared/services/pdf/unterhaltHelpers";
import type { BerHPdfFillFunction } from "../types";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E: Unterhaltszahlungen";

export const fillUnterhalt: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  const zahltPartnerUnterhalt = userData.partnerUnterhaltsSumme !== undefined;
  const kinder = userData.kinder ?? [];
  const hasKinder = kinder.length > 0;

  const unterhaltszahlungen = userData.unterhaltszahlungen ?? [];
  const hasUnterhaltszahlungen = unterhaltszahlungen.length > 0;

  if (!zahltPartnerUnterhalt && !hasUnterhaltszahlungen && !hasKinder) {
    return { pdfValues };
  } else if (
    kinder.length +
      unterhaltszahlungen.length +
      (zahltPartnerUnterhalt ? 1 : 0) >
    4
  ) {
    return addSupportRecipientsToAttachment({
      userData,
      pdfValues,
    })(ATTACHMENT_DESCRIPTION_SECTION_E, "e1Person1");
  }

  return enumerateSupportRecipients({ userData, pdfValues });
};

const enumerateSupportRecipients: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  let startCell = 1;
  if (userData.partnerUnterhaltsSumme !== undefined) {
    pdfValues.e1Person1.value = `${userData.partnerVorname} ${userData.partnerNachname}`;
    pdfValues.e3Familienverhaeltnis.value = "Ehepartner";
    pdfValues.e4Zahlung1.value = userData.partnerUnterhaltsSumme + " €";
    if (userData.partnerEinkommen === "yes") {
      pdfValues.e6Betrag1.value = userData.partnerEinkommenSumme + " €";
    } else {
      pdfValues.e5Einnahmen1.value = true;
    }
    startCell += 1;
  }

  if (userData.kinder && userData.kinder.length > 0) {
    userData.kinder.forEach((kind) => {
      pdfValues[`e1Person${startCell}` as keyof typeof pdfValues].value =
        `${kind.vorname} ${kind.nachname}`;
      pdfValues[
        `e2Geburtsdatum${startCell === 1 ? "" : startCell}` as keyof typeof pdfValues
      ].value = kind.geburtsdatum;
      pdfValues[
        `e3Familienverhaeltnis${startCell === 1 ? "" : startCell}` as keyof typeof pdfValues
      ].value = "Kind";
      // TODO: verify pruner works for unterhaltsSumme & einnahmen
      if ("unterhaltsSumme" in kind) {
        pdfValues[`e4Zahlung${startCell}` as keyof typeof pdfValues].value =
          kind.unterhaltsSumme + " €";
      }
      if ("einnahmen" in kind) {
        pdfValues[`e6Betrag${startCell}` as keyof typeof pdfValues].value =
          kind.einnahmen + " €";
      } else {
        pdfValues[`e5Einnahmen${startCell}` as keyof typeof pdfValues].value =
          true;
      }
      startCell += 1;
    });
  }

  if (userData.unterhaltszahlungen && userData.unterhaltszahlungen.length > 0) {
    userData.unterhaltszahlungen.forEach((supportRecipient) => {
      pdfValues[`e1Person${startCell}` as keyof typeof pdfValues].value =
        `${supportRecipient.firstName} ${supportRecipient.surname}`;
      pdfValues[
        `e2Geburtsdatum${startCell === 1 ? "" : startCell}` as keyof typeof pdfValues
      ].value = supportRecipient.birthday;
      pdfValues[
        `e3Familienverhaeltnis${startCell === 1 ? "" : startCell}` as keyof typeof pdfValues
      ].value = familyRelationshipMap[supportRecipient.familyRelationship];
      pdfValues[`e4Zahlung${startCell}` as keyof typeof pdfValues].value =
        supportRecipient.monthlyPayment + " €";
      pdfValues[`e5Einnahmen${startCell}` as keyof typeof pdfValues].value =
        true;
      startCell += 1;
    });
  }
  return { pdfValues };
};
