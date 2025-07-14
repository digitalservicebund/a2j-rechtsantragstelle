import fs from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";

export default async function loadHinweisblatt() {
  const filepath = path.resolve(
    path.join(process.cwd(), "public", "Hinweisblatt_Prozesskostenhilfe.pdf"),
  );

  const pdfDoc = await PDFDocument.load(fs.readFileSync(filepath));

  return pdfDoc;
}
