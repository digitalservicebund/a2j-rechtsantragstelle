import { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { BeratungshilfePDF } from "../beratungshilfe.generated";

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
  pdfFields.c2Einkuenftenetto.value = context.einkommen;
}
