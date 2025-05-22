import fs from "fs";
import fontkit from "@pdf-lib/fontkit";
import type { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfeFormularUserData } from "../../formular/userData";

export async function printNameInSignatureFormField(
  pdfDoc: PDFDocument,
  userData: ProzesskostenhilfeFormularUserData,
) {
  if (userData.versandArt === "digital") {
    // registering fontkit with PDFDocument to encode and embed Unicode characters like "ń", "ś", "ł"
    // without fontkit, pdf-lib will use simple encoding (WinAnsi) and will throw "WinAnsi cannot encode
    // "ń" when it does not know how to encode
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = fs.readFileSync(
      "public/fonts/BundesSansWeb-Regular.woff",
    );
    const font = await pdfDoc.embedFont(fontBytes, { subset: true });
    pdfDoc.getPage(3).drawText(`${userData.vorname} ${userData.nachname}`, {
      x: 200,
      y: 75,
      size: 10,
      font: font,
    });
  }
}
