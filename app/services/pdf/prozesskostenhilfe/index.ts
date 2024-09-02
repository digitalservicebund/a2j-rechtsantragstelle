import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { fillAbzuege } from "./F_abzuege";
import type { PdfFillFunctionReturnProps } from "./fillOutFunction";
import { fillBelastungen } from "./J_belastungen";
import { appendAttachment } from "../appendAttachment";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf.server";
export { getProzesskostenhilfeParameters };

export async function prozesskostenhilfePdfFromUserdata(
  userdata: ProzesskostenhilfeFormularContext,
) {
  let formObject: PdfFillFunctionReturnProps = {
    pdfValues: getProzesskostenhilfeParameters(),
    attachment: [],
  };

  formObject = fillAbzuege({ userdata, ...formObject });
  formObject = fillBelastungen({ userdata, ...formObject });

  const filledPdf = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues: formObject.pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44],
    xPositionsDruckvermerk: 9,
  });

  if (formObject.attachment && formObject.attachment.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: formObject.attachment,
          header: `Anhang: Antrag auf Bewilligung von Prozesskostenhilfe`,
          footer: "Anhang",
        }),
      ),
    );
  }
  return filledPdf;
}
