import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import Handout from "./Handout";
import { fillAngelegenheit } from "./sections/A_angelegenheit";
import { fillVorraussetzungen } from "./sections/B_vorraussetzungen";
import { fillEinkommen } from "./sections/C_einkommen";
import { fillWohnen } from "./sections/D_wohnen";
import { fillUnterhalt } from "./sections/E_unterhalt/E_unterhalt";
import { fillBesitz } from "./sections/F_besitz/F_besitz";
import { fillFooter } from "./sections/footer";
import { fillAusgaben } from "./sections/G_ausgaben";
import fillHeader from "./sections/header";
import { appendAttachment } from "../appendAttachment";
import { createAttachment } from "../attachment";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf";
export { getBeratungshilfeParameters };

export async function beratungshilfePdfFromUserdata(
  userdata: BeratungshilfeFormularContext,
) {
  const pdfFields = getBeratungshilfeParameters();
  const attachmentData = createAttachment();

  fillHeader(attachmentData, pdfFields, userdata);
  fillAngelegenheit(attachmentData, pdfFields, userdata);
  fillVorraussetzungen(pdfFields, userdata);
  fillEinkommen(pdfFields, userdata);
  fillUnterhalt(attachmentData, pdfFields, userdata);
  fillBesitz(attachmentData, pdfFields, userdata);
  fillAusgaben(attachmentData, pdfFields, userdata);
  fillWohnen(pdfFields, userdata);
  fillFooter(pdfFields, userdata);

  const filledPdf = await fillPdf("/beratungshilfe/antrag", pdfFields);

  if (attachmentData.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: attachmentData,
          header: `Anhang: Antrag auf Bewilligung von Beratungshilfe zum Antrag von ${userdata.vorname} ${userdata.nachname}`,
          footer: "Anhang",
        }),
      ),
    );
  }

  await appendAttachment(
    filledPdf,
    await pdfFromReact(Handout(userdata, "Merkblatt")),
  );
  return filledPdf;
}
