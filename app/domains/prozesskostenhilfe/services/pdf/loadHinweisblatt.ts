import fs from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { addDruckvermerk } from "~/services/pdf/druckvermerk";
import { dataDirectory } from "~/services/pdf/pdf.generator";

export default async function loadHinweisblatt({
  yPositionDruckvermerk,
  xPositionDruckvermerk,
}: {
  yPositionDruckvermerk: number;
  xPositionDruckvermerk: number;
}) {
  const filepath = path.resolve(
    path.join(
      process.cwd(),
      dataDirectory,
      "prozesskostenhilfe",
      "Formular_Hinweisblatt_Prozess_Verfahrenskostenhilfe.pdf",
    ),
  );

  const pdfDoc = await PDFDocument.load(fs.readFileSync(filepath));

  addDruckvermerk(pdfDoc, yPositionDruckvermerk, xPositionDruckvermerk);

  return pdfDoc;
}
