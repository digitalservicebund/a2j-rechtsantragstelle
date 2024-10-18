import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import { attachBankkontenToAnhang } from "~/services/pdf/shared/attachBankkontenToAnhang";
import { arrayIsNonEmpty } from "~/util/array";

export const fillBankkonto: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.nein_37.value = userData.hasBankkonto === "no";
  pdfValues.ja_36.value = userData.hasBankkonto === "yes";
  const { bankkonten } = userData;
  if (!arrayIsNonEmpty(bankkonten)) return { pdfValues };
  pdfValues.artdesKontosKontoinhaberKreditinstitut.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  const { attachment } = attachBankkontenToAnhang([], bankkonten);
  return { pdfValues, attachment };
};

export const fillEigentum: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillBankkonto],
  });
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "G Eigentum", level: "h2" }, ...attachment]
        : [],
  };
};
