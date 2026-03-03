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
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { formatIban } from "~/services/validation/iban";
import { createStamp } from "~/services/pdf/footer/createStamp";

const SUBJECT_TITLE =
  "Umwandlung meines Girokontos in ein Pfändungsschutzkonto (P-Konto) gemäß § 850k Absatz 1 Satz 1 ZPO ";

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
        .text(`${userData.vollstaendigerName} `, PDF_MARGIN_HORIZONTAL)
        .text(`${userData.kontoinhaberStrasseHausnummer} `)
        .text(`${userData.kontoinhaberPlz} ${userData.kontoinhaberOrt} `)
        .text(userData.kontoinhaberLand ? `${userData.kontoinhaberLand} ` : "")
        .text(userData.telefonnummer ? `${userData.telefonnummer} ` : "");
    }),
  );
  documentStruct.add(headerSect);
  if (userData.emailadresse) {
    headerSect.add(
      doc.struct("Link", {}, () => {
        doc.text(`${userData.emailadresse} `);
      }),
    );
  }

  doc.moveDown(2);
};

const createBody: PDFDocumentBuilder<KontopfaendungPkontoAntragUserData> = (
  doc,
  documentStruct,
  userData,
) => {
  const anredeSect = doc.struct("Sect");
  anredeSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_BOLD)
        .text("An ")
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(userData.bankName ? `${userData.bankName} ` : "");
    }),
  );
  documentStruct.add(anredeSect);

  doc.moveDown(2);

  const bodySect = doc.struct("Sect");
  bodySect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`${userData.kontoinhaberOrt}, ${toGermanDateFormat(today())} `);
      doc.moveDown(1);
    }),
  );
  bodySect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(`${SUBJECT_TITLE} `);
      doc
        .moveDown(1)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`Kontoinhaber: ${userData.vollstaendigerName} `);
      doc.moveDown(1);
      doc.text(`IBAN: ${formatIban(userData.iban ?? "")} `);
      doc.moveDown(1);
      doc.text("Sehr geehrte Damen und Herren, ");
      doc.moveDown(1);
      doc.text(
        "bitte wandeln Sie mein oben genanntes Girokonto schnellstmöglich, jedoch nicht später als innerhalb der in § 850k Absatz 2 Satz 1 ZPO genannten Frist, in ein Pfändungsschutzkonto (P-Konto) um. ",
      );
      doc.moveDown(1);
      doc.text(
        "Ich versichere, dass ich kein weiteres Pfändungsschutzkonto unterhalte. ",
      );
      doc.moveDown(1);
      doc.text(
        "Ich bitte Sie, mir die Umwandlung des Kontos schriftlich zu bestätigen. ",
      );
      doc.moveDown(1);
      doc.text(
        "Bei Bedarf werde ich Erhöhungsbeträge (zum Beispiel für den Eingang von Sozialleistungen) mit einer entsprechenden Bescheinigung nachweisen. ",
      );
      doc.moveDown(1);
      doc.text("Mit freundlichen Grüßen ");
    }),
  );

  documentStruct.add(bodySect);

  doc.moveDown(3);

  const [docX, docY] = [doc.x, doc.y];
  doc.dash(1, { space: 1 });
  doc.markContent("Artifact", { type: "Layout" });
  doc
    .moveTo(docX, docY)
    .lineTo(docX + 105, docY)
    .stroke();
  doc.endMarkedContent();
  doc.undash();

  const signatureSect = doc.struct("Sect");
  signatureSect.add(
    doc.struct("P", {}, () => {
      doc.text("[Unterschrift] ");
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
  const footerSect = doc.struct("Sect");
  createStamp(doc, footerSect, true);
  documentStruct.add(footerSect);
};

export function pKontoPdfFromUserdata(
  userData: KontopfaendungPkontoAntragUserData,
) {
  return pdfFromUserData(userData, buildKontopfaendungPDFDocument);
}
