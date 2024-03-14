import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export function fillVorraussetzungen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein.value =
    context.rechtsschutzversicherung === "no";
  pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden.value =
    context.beratungshilfeBeantragt === "no";
  pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen.value =
    context.eigeninitiativeGrundvorraussetzung === "no";
  pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt.value =
    context.klageEingereicht === "no";
}
