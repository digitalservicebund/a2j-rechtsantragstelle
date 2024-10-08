import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import Handout from "./Handout";
import { appendAttachment } from "../appendAttachment";
import type { PdfFillFunction } from "../fillOutFunction";
import { pdfFillReducer } from "../fillOutFunction";
import { fillAngelegenheit } from "./sections/A_angelegenheit";
import { fillVorraussetzungen } from "./sections/B_vorraussetzungen";
import { fillEinkommen } from "./sections/C_einkommen";
import { fillWohnen } from "./sections/D_wohnen";
import { fillUnterhalt } from "./sections/E_unterhalt";
import { fillBesitz } from "./sections/F_besitz/F_besitz";
import { fillFooter } from "./sections/footer";
import { fillAusgaben } from "./sections/G_ausgaben";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf.server";
import { fillHeader } from "./sections/header";
export { getBeratungshilfeParameters };

export type BerHPdfFillFunction = PdfFillFunction<
  BeratungshilfeFormularContext,
  BeratungshilfePDF
>;

export async function beratungshilfePdfFromUserdata(
  userData: BeratungshilfeFormularContext,
) {
  const { pdfValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: getBeratungshilfeParameters(),
    fillFunctions: [
      fillHeader,
      fillAngelegenheit,
      fillVorraussetzungen,
      fillEinkommen,
      fillUnterhalt,
      fillBesitz,
      fillAusgaben,
      fillWohnen,
      fillFooter,
    ],
  });

  const filledPdf = await fillPdf({
    flowId: "/beratungshilfe/antrag",
    pdfValues,
    yPositionsDruckvermerk: [90, 108, 138],
    xPositionsDruckvermerk: 28,
  });

  if (attachment.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: attachment,
          header: `Anhang: Antrag auf Bewilligung von Beratungshilfe zum Antrag von ${userData.vorname} ${userData.nachname}`,
          footer: "Anhang",
        }),
      ),
    );
  }

  await appendAttachment(
    filledPdf,
    await pdfFromReact(Handout(userData, "Merkblatt")),
  );
  return await filledPdf.save();
}
