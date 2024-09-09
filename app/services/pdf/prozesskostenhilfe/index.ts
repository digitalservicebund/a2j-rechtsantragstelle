import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { fillBruttoEinnahmen } from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen";
import { pdfFillReducer } from "~/services/pdf/prozesskostenhilfe/fillOutFunction";
import { fillAbzuege } from "./F_abzuege";
import { fillZahlungsverpflichtungen } from "./I_zahlungsverpflichtungen";
import { fillBelastungen } from "./J_belastungen";
import { appendAttachment } from "../appendAttachment";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import { fillPdf } from "../fillPdf.server";
export { getProzesskostenhilfeParameters };

export async function prozesskostenhilfePdfFromUserdata(
  userData: ProzesskostenhilfeFormularContext,
) {
  const { pdfValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: getProzesskostenhilfeParameters(),
    fillFunctions: [
      fillBruttoEinnahmen,
      fillAbzuege,
      fillBelastungen,
      fillZahlungsverpflichtungen,
    ],
  });

  const filledPdf = await fillPdf({
    flowId: "/prozesskostenhilfe/formular",
    pdfValues,
    yPositionsDruckvermerk: [43, 51, 40, 44],
    xPositionsDruckvermerk: 9,
  });

  if (attachment.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: attachment,
          header: `Anhang: Antrag auf Bewilligung von Prozesskostenhilfe`,
          footer: "Anhang",
        }),
      ),
    );
  }
  return filledPdf;
}
