import type { BerHPdfFillFunction } from "../types";

export const fillVorraussetzungen: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  pdfValues.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein.value =
    userData.rechtsschutzversicherung === "no";
  pdfValues.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden.value =
    userData.beratungshilfeBeantragt === "no";
  pdfValues.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen.value =
    userData.eigeninitiativeGrundvorraussetzung === "no";
  pdfValues.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt.value =
    userData.klageEingereicht === "no";
  return { pdfValues };
};
