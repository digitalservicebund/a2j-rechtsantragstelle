import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { appendPdfToPdf } from "~/services/pdf/appendPdfToPdf";
import FormAttachment from "~/services/pdf/attachment/FormAttachment";
import { pdfFromReact } from "~/services/pdf/attachment/pdfFromReact";
import {
  type PdfFillFunction,
  pdfFillReducer,
} from "~/services/pdf/fillOutFunction";
import { fillPdf } from "~/services/pdf/fillPdf.server";
import { fillPerson } from "./A_person";
import { fillRechtsschutzversicherung } from "./B_rechtsschutzversicherung";
import { fillUnterhaltsanspruch } from "./C_unterhaltspflichtige_person";
import { fillUnterhaltAngehoerige } from "./D_angehoerige";
import { fillOwnBruttoEinnahmen } from "./E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { fillBruttoEinnahmenPartner } from "./E_bruttoEinnahmen/bruttoEinnahmen_partner";
import { fillAbzuege } from "./F_abzuege";
import { fillEigentum } from "./G_eigentum";
import { fillGrundvoraussetzungen } from "./grundvoraussetzungen";
import { fillWohnkosten } from "./H_wohnkosten";
import { fillZahlungsverpflichtungen } from "./I_zahlungsverpflichtungen";
import { fillBelastungen } from "./J_belastungen";
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
      fillRechtsschutzversicherung,
      fillGrundvoraussetzungen,
      fillUnterhaltsanspruch,
      fillUnterhaltAngehoerige,
      fillOwnBruttoEinnahmen,
      fillBruttoEinnahmenPartner,
      fillAbzuege,
      fillEigentum,
      fillBelastungen,
      fillWohnkosten,
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
    await appendPdfToPdf(
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
