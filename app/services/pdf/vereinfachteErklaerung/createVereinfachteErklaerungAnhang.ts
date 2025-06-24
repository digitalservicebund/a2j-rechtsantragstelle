import type PDFDocument from "pdfkit";
import { versandDigitalGericht } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/guards";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { getFinancialEntryMonthlyAverage } from "~/domains/prozesskostenhilfe/services/pdf/util";
import { createHeading } from "~/services/pdf/createHeading";
import { createHeader } from "~/services/pdf/header/createHeader";
import { pdfStyles } from "~/services/pdf/pdfStyles";
import { arrayIsNonEmpty } from "~/util/array";
import { toGermanDateFormat, today } from "~/util/date";

const gapBetweenDateAndSignature = 124;

export const createVereinfachteErklaerungAnhang = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: ProzesskostenhilfeFormularUserData,
) => {
  doc.addPage();
  createHeader(
    doc,
    documentStruct,
    userData,
    "Vereinfachte Erklärung für die Beantragung von Prozesskostenhilfe",
  );
  createHeading(
    doc,
    documentStruct,
    "Vereinfachte Erklärung gem. §2 PKHFV",
    "H1",
  );

  documentStruct.add(
    doc.struct("P", undefined, () => {
      doc
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.bold.font)
        .text("Eltern / gesetzliche Vertretung")
        .font(pdfStyles.page.font)
        .text(`${userData.vorname} ${userData.nachname}`)
        .text(userData.strasseHausnummer ?? "")
        .text(`${userData.plz} ${userData.ort}`);

      doc
        .moveDown()
        .font(pdfStyles.h2.font)
        .fontSize(pdfStyles.h2.fontSize)
        .text("Angaben zum Kind")
        .fontSize(pdfStyles.page.fontSize)
        .moveDown()
        .font(pdfStyles.bold.font)
        .text("Name des Kindes")
        .font(pdfStyles.page.font)
        .text(`${userData.child?.vorname} ${userData.child?.nachname}`)
        .moveDown()
        .font(pdfStyles.bold.font)
        .text("Geburtsdatum")
        .font(pdfStyles.page.font)
        .text(userData.child?.geburtsdatum ?? "")
        .moveDown()
        .font(pdfStyles.bold.font)
        .text("Kind lebt im Haushalt")
        .font(pdfStyles.page.font)
        .text(userData.livesTogether ? "Ja" : "Nein");

      doc
        .moveDown()
        .font(pdfStyles.bold.font)
        .text("Monatliches Einkommen")
        .font(pdfStyles.page.font);
      if (arrayIsNonEmpty(userData.einnahmen)) {
        userData.einnahmen.forEach((einnahme) => {
          doc.text(
            `${getFinancialEntryMonthlyAverage(einnahme)}€ ${einnahme.beschreibung}`,
          );
        });
      } else {
        doc.text("Keine eigenen Einnahmen");
      }

      doc
        .moveDown()
        .font(pdfStyles.bold.font)
        .text("Vermögen")
        .font(pdfStyles.page.font);
      if (arrayIsNonEmpty(userData.vermoegen)) {
        userData.vermoegen.forEach((vermoegen) => {
          doc.text(`${vermoegen.wert}€ ${vermoegen.beschreibung}`);
        });
      } else {
        doc.text("Kein eigenes Vermögen");
      }
    }),
  );

  documentStruct.add(
    doc.struct("Sect", undefined, () => {
      doc
        .moveDown(10)
        .font(pdfStyles.page.font)
        .text(
          versandDigitalGericht({ context: userData })
            ? toGermanDateFormat(today())
            : "",
        );

      const [dateX, dateY] = [doc.x, doc.y, doc.currentLineHeight()];

      doc
        .moveUp()
        .text(
          versandDigitalGericht({ context: userData })
            ? `${userData.vorname} ${userData.nachname}`
            : "",
          doc.x + gapBetweenDateAndSignature,
        );

      doc
        .moveDown()
        .moveTo(dateX, dateY)
        .lineTo(dateX + 100, dateY)
        .stroke()
        .moveTo(dateX + gapBetweenDateAndSignature, dateY)
        .lineTo(doc.x + 200, dateY)
        .stroke();

      doc
        .text("Datum", dateX, dateY)
        .moveUp()
        .text(
          "Unterschrift der Eltern / gesetzlichen Vertretung",
          dateX + gapBetweenDateAndSignature,
          dateY,
        );
    }),
  );
};
