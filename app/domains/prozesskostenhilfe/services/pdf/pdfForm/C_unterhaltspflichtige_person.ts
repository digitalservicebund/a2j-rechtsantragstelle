import { familyRelationshipMap } from "~/domains/shared/services/pdf/unterhaltHelpers";
import type { PkhPdfFillFunction } from "../types";
import { removeDecimalsFromCurrencyString } from "~/util/strings";
import { type AttachmentEntries } from "~/services/pdf/attachment";
import { nettoString } from "~/domains/prozesskostenhilfe/services/pdf/pdfForm/E_bruttoEinnahmen/bruttoEinnahmen_eigenes";

export const unterhaltsAnspruchSonstigesAttachmentTitle =
  "Anmerkung zu Unterhaltsanspruch und -zahlungen";

export const fillUnterhaltsanspruch: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const unterhaltspflichtigePerson = userData.unterhaltspflichtigePerson;
  const attachment: AttachmentEntries = [];
  if (userData.unterhaltsanspruch === "unterhalt") {
    pdfValues.e14.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchUnterhaltinEuro.value = `${removeDecimalsFromCurrencyString(userData.unterhaltsSumme)} ${nettoString}`;
    if (
      unterhaltspflichtigePerson?.vorname &&
      unterhaltspflichtigePerson.nachname &&
      unterhaltspflichtigePerson.beziehung
    ) {
      pdfValues.c2.value = true;
      pdfValues.namedesUnterhaltspflichtigen.value = `${unterhaltspflichtigePerson.vorname} ${unterhaltspflichtigePerson.nachname}, ${familyRelationshipMap[unterhaltspflichtigePerson.beziehung]}`;
    } else {
      pdfValues.c1.value = true;
    }
  } else if (userData.unterhaltsanspruch === "sonstiges") {
    pdfValues.monatlicheBruttoeinnahmendurchUnterhaltinEuro.value = "s. Anhang";
    pdfValues.namedesUnterhaltspflichtigen.value = "s. Anhang";
    attachment.push({
      title: unterhaltsAnspruchSonstigesAttachmentTitle,
      text: userData.unterhaltsbeschreibung,
      level: "h2",
    });
    return { pdfValues, attachment };
  } else {
    pdfValues.e13.value = true;
  }

  return { pdfValues, attachment };
};
