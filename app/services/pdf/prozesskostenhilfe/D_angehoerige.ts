import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";

export const fillAngehoerige: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    userData.partnerschaft === "yes" &&
    userData.zusammenleben === "no" &&
    userData.unterhalt === "yes" &&
    userData.unterhaltsSumme &&
    userData.partnerVorname &&
    userData.partnerNachname
  ) {
    pdfValues.verhaeltnis1.value = "Partner:in";
    pdfValues.angehoerigerNummereins.value = `${userData.partnerVorname} ${userData.partnerNachname}, lebt getrennt`;
    pdfValues.monatsbetrag1.value = userData.unterhaltsSumme + " €";
  }
  return { pdfValues };
};
