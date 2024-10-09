import type { BerHPdfFillFunction } from "..";

export const fillEinkommen: BerHPdfFillFunction = ({
  userData: { einkommen, partnerEinkommenSumme },
  pdfValues,
}) => {
  pdfValues.c2Einkuenftenetto.value = einkommen ?? "";
  pdfValues.c3EinkuenftePartner.value = partnerEinkommenSumme !== undefined;
  pdfValues.c4EinkuenftePartnernetto.value = partnerEinkommenSumme ?? "";
  return { pdfValues };
};
