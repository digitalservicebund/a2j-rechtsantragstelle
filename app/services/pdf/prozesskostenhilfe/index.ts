import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { appendAttachment } from "../appendAttachment";
import { createAttachment } from "../attachment";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf.server";
export { getProzesskostenhilfeParameters };

export async function prozesskostenhilfePdfFromUserdata(
  _userdata: ProzesskostenhilfeFormularContext,
) {
  const pdfValues = getProzesskostenhilfeParameters();
  const attachmentData = createAttachment();

  const filledPdf = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44],
    xPositionsDruckvermerk: 9,
  });

  if (attachmentData.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: attachmentData,
          header: `Anhang: Antrag auf Bewilligung von Prozesskostenhilfe`,
          footer: "Anhang",
        }),
      ),
    );
  }
  return filledPdf;
}
