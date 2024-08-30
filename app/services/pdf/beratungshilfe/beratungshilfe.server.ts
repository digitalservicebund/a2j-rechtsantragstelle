import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { logError } from "~/services/logging";
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
import { addDruckvermerk } from "../druckvermerk";
import { isBooleanField } from "../fileTypes";
import { changeBooleanField, changeStringField } from "../pdf.server";
import { resizeToA4 } from "../resizeToA4";
export { getBeratungshilfeParameters };

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeFormularContext,
) {
  const pdfFields = getBeratungshilfeParameters();
  const attachmentData = createAttachment();

  fillHeader(attachmentData, pdfFields, context);
  fillAngelegenheit(attachmentData, pdfFields, context);
  fillVorraussetzungen(pdfFields, context);
  fillEinkommen(pdfFields, context);
  fillUnterhalt(attachmentData, pdfFields, context);
  fillBesitz(attachmentData, pdfFields, context);
  fillAusgaben(attachmentData, pdfFields, context);
  fillWohnen(pdfFields, context);
  fillFooter(pdfFields, context);

  const filledPdf = await generatePdf(pdfFields);

  if (attachmentData.length > 0) {
    await appendAttachment(
      filledPdf,
      await pdfFromReact(
        FormAttachment({
          entries: attachmentData,
          header: `Anhang: Antrag auf Bewilligung von Beratungshilfe zum Antrag von ${context.vorname} ${context.nachname}`,
          footer: "Anhang",
        }),
      ),
    );
  }

  await appendAttachment(
    filledPdf,
    await pdfFromReact(Handout(context, "Merkblatt")),
  );
  return filledPdf;
}

async function generatePdf(values: BeratungshilfePDF) {
  const pdfDoc = await PDFDocument.load(await getBeratungshilfePdfBuffer());
  const yPositionsDruckvermerk = [90, 108, 138];
  resizeToA4(pdfDoc);
  addDruckvermerk(pdfDoc, yPositionsDruckvermerk);

  const form = pdfDoc.getForm();

  Object.values(values).forEach((value) => {
    if (isBooleanField(value)) {
      changeBooleanField(value, form);
    } else {
      changeStringField(value, form);
    }
  });

  return pdfDoc;
}

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var, sonarjs/no-var
  var __beratungshilfePdf: Buffer | undefined; // NOSONAR
}

// Singleton to prevent multiple file reads
async function getBeratungshilfePdfBuffer() {
  if (!global.__beratungshilfePdf) {
    const relFilepath =
      "data/pdf/beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf";
    const filepath = path.resolve(path.join(process.cwd(), relFilepath));
    try {
      const fileBuffer = await readFile(filepath);
      global.__beratungshilfePdf = fileBuffer;
    } catch (error) {
      logError({ error });
    }
  }

  return global.__beratungshilfePdf ?? ArrayBuffer.prototype;
}
