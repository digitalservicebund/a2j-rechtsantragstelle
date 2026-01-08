import { createFooter } from "~/domains/shared/services/pdf/createFooter";
import { setPdfMetadata } from "~/domains/shared/services/pdf/setPdfMetadata";
import { type KontopfaendungPkontoAntragUserData } from "~/domains/kontopfaendung/pkonto/antrag/userData";
import {
  type PDFDocumentBuilder,
  pdfFromUserData,
} from "~/services/pdf/pdfFromUserData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { toGermanDateFormat, today } from "~/util/date";

const BODY_TITLE =
  "Umwandlung meines Girokontos in ein Pfändungsschutzkonto (P-Konto) gemäß § 850k Absatz 1 Satz 1 ZPO";

const createHeader: PDFDocumentBuilder<KontopfaendungPkontoAntragUserData> = (
  doc,
  documentStruct,
  userData,
) => {
  const headerSect = doc.struct("Sect");
  headerSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `${userData.kontoinhaberVorname} ${userData.kontoinhaberNachname}`,
          PDF_MARGIN_HORIZONTAL,
        )
        .text(
          `${userData.kontoinhaberStrasse} ${userData.kontoinhaberHausnummer}`,
        )
        .text(`${userData.kontoinhaberPlz} ${userData.kontoinhaberOrt}`)
        .text(userData.telefonnummer ?? "")
        .text(userData.emailadresse ?? "");
    }),
  );
  documentStruct.add(headerSect);

  doc.moveDown(2);
};

const createBody: PDFDocumentBuilder<KontopfaendungPkontoAntragUserData> = (
  doc,
  documentStruct,
  userData,
) => {
  const anredeSect = doc.struct("Sect");
  anredeSect.add(
    doc.struct("H1", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text("An");
    }),
  );
  anredeSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).text(userData.bankName ?? "");
    }),
  );
  documentStruct.add(anredeSect);

  doc.moveDown(2);

  const bodySect = doc.struct("Sect");
  bodySect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`${userData.kontoinhaberOrt}, ${toGermanDateFormat(today())}`);
      doc.moveDown(1);
    }),
  );
  bodySect.add(
    doc.struct("H1", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(BODY_TITLE);
      doc.moveDown(1);
    }),
  );
  bodySect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          `Kontoinhaber: ${userData.kontoinhaberVorname} ${userData.kontoinhaberNachname}`,
        );
      doc.moveDown(1);
      doc.text(`IBAN: ${userData.iban}`);
      doc.moveDown(1);
      doc.text("Sehr geehrte Damen und Herren,");
      doc.moveDown(1);
      doc.text(
        "Bitte wandeln Sie mein oben genanntes Girokonto schnellstmöglich, jedoch nicht später als innerhalb der in § 850k Absatz 2 Satz 1 genannten Frist, in ein Pfändungsschutzkonto (P-Konto) um.",
      );
      doc.moveDown(1);
      doc.text(
        "Ich versichere, dass ich kein weiteres Pfändungsschutzkonto unterhalte.",
      );
      doc.moveDown(1);
      doc.text(
        "Ich bitte Sie, mir die Umwandlung des Kontos schriftlich zu bestätigen.",
      );
      doc.moveDown(1);
      doc.text(
        "Bei Bedarf werde ich Erhöhungsbeträge (zum Beispiel für den Eingang von Sozialleistungen) mit einer entsprechenden Bescheinigung nachweisen.",
      );
      doc.moveDown(1);
      doc.text("Mit freundlichen Grüßen");
    }),
  );

  documentStruct.add(bodySect);

  doc.moveDown(3);

  const signatureSect = doc.struct("Sect");
  signatureSect.add(
    doc.struct("P", {}, () => {
      const [docX, docY] = [doc.x, doc.y];
      doc
        .moveTo(docX, docY)
        .lineTo(docX + 105, docY)
        .dash(1, { space: 1 })
        .stroke();
      doc.text("[Unterschrift]");
    }),
  );
  documentStruct.add(signatureSect);
};

const buildKontopfaendungPDFDocument: PDFDocumentBuilder<
  KontopfaendungPkontoAntragUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc, {
    title: "Antrag nach Pfändung",
    subject: "Kontopfändung",
    keywords: "Kontopfändung",
  });
  createHeader(doc, documentStruct, userData);
  createBody(doc, documentStruct, userData);
  createFooter(doc, documentStruct, userData);
};

export function kontopfaendungPdfFromUserdata(
  userData: KontopfaendungPkontoAntragUserData,
) {
  return pdfFromUserData(userData, buildKontopfaendungPDFDocument);
}
