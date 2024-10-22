import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { fillAngehoerige } from "~/services/pdf/prozesskostenhilfe/D_angehoerige";
import { fillSelfBruttoEinnahmen } from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { fillBruttoEinnahmenPartner } from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen/bruttoEinnahmen_partner";
import { fillEigentum } from "~/services/pdf/prozesskostenhilfe/G_eigentum";
import { fillGrundvoraussetzungen } from "~/services/pdf/prozesskostenhilfe/grundvoraussetzungen";
import { fillAbzuege } from "./F_abzuege";
import { fillZahlungsverpflichtungen } from "./I_zahlungsverpflichtungen";
import { fillBelastungen } from "./J_belastungen";
import { appendAttachment } from "../appendAttachment";
import FormAttachment from "../attachment/FormAttachment";
import { pdfFromReact } from "../attachment/pdfFromReact";
import type { PdfFillFunction } from "../fillOutFunction";
import { pdfFillReducer } from "../fillOutFunction";
import { fillPdf } from "../fillPdf.server";
import { fillPerson } from "./A_person";
export { getProzesskostenhilfeParameters };

export type PkhPdfFillFunction = PdfFillFunction<
  ProzesskostenhilfeFormularContext,
  ProzesskostenhilfePDF
>;

export async function prozesskostenhilfePdfFromUserdata(
  userData: ProzesskostenhilfeFormularContext,
) {
  const { pdfValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: getProzesskostenhilfeParameters(),
    fillFunctions: [
      fillPerson,
      fillGrundvoraussetzungen,
      fillAngehoerige,
      fillSelfBruttoEinnahmen,
      fillBruttoEinnahmenPartner,
      fillAbzuege,
      fillEigentum,
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
