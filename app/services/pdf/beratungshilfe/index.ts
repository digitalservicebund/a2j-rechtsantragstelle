import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import Handout from "./Handout";
import { appendAttachment } from "../appendAttachment";
import { createAttachment } from "../attachment";
import { fillAngelegenheit } from "./sections/A_angelegenheit";
import { fillVorraussetzungen } from "./sections/B_vorraussetzungen";
import { fillEinkommen } from "./sections/C_einkommen";
import { fillWohnen } from "./sections/D_wohnen";
import { fillUnterhalt } from "./sections/E_unterhalt/E_unterhalt";
import { fillBesitz } from "./sections/F_besitz/F_besitz";
import { fillFooter } from "./sections/footer";
import { fillAusgaben } from "./sections/G_ausgaben";
import fillHeader from "./sections/header";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf.server";
export { getBeratungshilfeParameters };

export async function beratungshilfePdfFromUserdata(
  userdata: BeratungshilfeFormularContext,
) {
  const pdfValues = getBeratungshilfeParameters();
  const attachmentData = createAttachment();

  fillHeader(attachmentData, pdfValues, userdata);
  fillAngelegenheit(attachmentData, pdfValues, userdata);
  fillVorraussetzungen(pdfValues, userdata);
  fillEinkommen(pdfValues, userdata);
  fillUnterhalt(attachmentData, pdfValues, userdata);
  fillBesitz(attachmentData, pdfValues, userdata);
  fillAusgaben(attachmentData, pdfValues, userdata);
  fillWohnen(pdfValues, userdata);
  fillFooter(pdfValues, userdata);

  const filledPdf = await fillPdf({
    flowId: "/beratungshilfe/antrag",
    pdfValues,
    yPositionsDruckvermerk: [90, 108, 138],
    xPositionsDruckvermerk: 28,
  });

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
