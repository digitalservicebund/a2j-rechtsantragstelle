import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillAngehoerige: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.partnerschaft === "yes") {
    pdfValues.verhaeltnis1.value = "Ehepartner";
    if (userData.partnerVorname && userData.partnerNachname) {
      pdfValues.angehoerigerNummereins.value = `${userData.partnerVorname} ${userData.partnerNachname}`;
    }
    if (userData.unterhalt && userData.unterhaltsSumme) {
      pdfValues.monatsbetrag1.value = userData.unterhaltsSumme + " €";
    }
    if (userData.partnerEinkommen) {
      pdfValues.ja_4.value = true;
      // TODO: calculate mthl euro netto?
    } else {
      pdfValues.eigeneEinnahmen1.value = true;
    }
  }
  return { pdfValues };
};
