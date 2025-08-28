import { empfaengerIsChild } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/guards";
import { getTotalMonthlyFinancialEntries } from "~/domains/prozesskostenhilfe/services/pdf/util";
import {
  addSupportRecipientsToAttachment,
  familyRelationshipMap,
} from "~/domains/shared/services/pdf/unterhaltHelpers";
import type { PkhPdfFillFunction } from "../types";

export const ATTACHMENT_DESCRIPTION_SECTION_D =
  "FELD D: Angehörige, denen Sie Bar- oder Naturalunterhalt gewähren";

export const fillUnterhaltAngehoerige: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const zahltPartnerUnterhalt = userData.partnerUnterhaltsSumme !== undefined;
  const kinder = userData.kinder ?? [];
  // Need to add the child added as a part of Vereinfachte Erklärung to the kinder array
  if (
    empfaengerIsChild({ context: userData }) &&
    userData.child !== undefined
  ) {
    kinder.unshift({
      ...userData.child,
      wohnortBeiAntragsteller: userData.livesTogether ? "yes" : "no",
      einnahmen: userData.einnahmen
        ? getTotalMonthlyFinancialEntries(userData.einnahmen)
        : undefined,
    });
  }
  const hasKinder = kinder.length > 0;

  const unterhaltszahlungen = userData.unterhaltszahlungen ?? [];
  const hasUnterhaltszahlungen = unterhaltszahlungen.length > 0;

  if (!zahltPartnerUnterhalt && !hasUnterhaltszahlungen && !hasKinder) {
    return { pdfValues };
  } else if (
    kinder.length +
      unterhaltszahlungen.length +
      (zahltPartnerUnterhalt ? 1 : 0) >
    5
  ) {
    return addSupportRecipientsToAttachment({
      userData: { ...userData, kinder },
      pdfValues,
    })(ATTACHMENT_DESCRIPTION_SECTION_D, "angehoerigerNr1");
  }

  return enumerateSupportRecipients({
    userData: { ...userData, kinder },
    pdfValues,
  });
};

const enumerateSupportRecipients: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  let startCell = 1;
  if (userData.partnerUnterhaltsSumme !== undefined) {
    pdfValues.angehoerigerNr1.value = `${userData.partnerVorname} ${userData.partnerNachname}`;
    pdfValues.verhaeltnis1.value = "Ehepartner";
    pdfValues.monatsbetrag1.value = userData.partnerUnterhaltsSumme + " €";
    if (userData.partnerEinkommen === "yes") {
      pdfValues.d2.value = true;
      pdfValues.betrag1.value = "Siehe E-F";
    } else {
      pdfValues.d1.value = true;
    }
    startCell += 1;
  }
  if (userData.kinder && userData.kinder.length > 0) {
    userData.kinder.forEach((kind) => {
      pdfValues[`angehoerigerNr${startCell}` as keyof typeof pdfValues].value =
        `${kind.vorname} ${kind.nachname}`;
      pdfValues[`geburtsdatum${startCell}` as keyof typeof pdfValues].value =
        kind.geburtsdatum;
      pdfValues[`verhaeltnis${startCell}` as keyof typeof pdfValues].value =
        "Kind";
      if (kind.unterhalt === "yes" || kind.unterhaltsSumme !== undefined) {
        pdfValues[`monatsbetrag${startCell}` as keyof typeof pdfValues].value =
          kind.unterhaltsSumme + " €";
      }
      if (kind.eigeneEinnahmen === "yes" && kind.einnahmen !== undefined) {
        pdfValues[`d${startCell * 2}` as keyof typeof pdfValues].value = true;
        pdfValues[`betrag${startCell}` as keyof typeof pdfValues].value =
          kind.einnahmen + " €";
      } else {
        pdfValues[`d${startCell * 2 - 1}` as keyof typeof pdfValues].value =
          true;
      }
      startCell += 1;
    });
  }
  if (userData.unterhaltszahlungen && userData.unterhaltszahlungen.length > 0) {
    userData.unterhaltszahlungen.forEach((supportRecipient) => {
      pdfValues[`angehoerigerNr${startCell}` as keyof typeof pdfValues].value =
        `${supportRecipient.firstName} ${supportRecipient.surname}`;
      pdfValues[`geburtsdatum${startCell}` as keyof typeof pdfValues].value =
        supportRecipient.birthday;
      pdfValues[`verhaeltnis${startCell}` as keyof typeof pdfValues].value =
        familyRelationshipMap[supportRecipient.familyRelationship];
      pdfValues[`monatsbetrag${startCell}` as keyof typeof pdfValues].value =
        supportRecipient.monthlyPayment + " €";
      pdfValues[`d${startCell * 2 - 1}` as keyof typeof pdfValues].value = true;
      startCell += 1;
    });
  }

  return { pdfValues };
};
