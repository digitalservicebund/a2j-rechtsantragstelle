import type PDFDocument from "pdfkit";
import { getAntragNumber } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const createSonstigerAntragUndAusfuehrung = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const addSection = (title: string, paragraphs: string[]) => {
    if (paragraphs.length === 0) return;

    const section = doc.struct("Sect");
    documentStruct.add(section);
    section.add(
      doc.struct("H2", {}, () => {
        doc
          .fontSize(12)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(title, PDF_MARGIN_HORIZONTAL);
        doc.moveDown(0.5);
      }),
    );
    for (const text of paragraphs) {
      section.add(
        doc.struct("P", {}, () => {
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_REGULAR)
            .text(text, PDF_MARGIN_HORIZONTAL);
          doc.moveDown(0.5);
        }),
      );
    }
  };

  addSection(
    "Sonstige Anträge und Ausführungen",
    (userData.sonstigeAntraege ?? []).map(
      (antrag, index) =>
        `${getAntragNumber(userData, "sonstigeAntraege", index)}. ${antrag.antrag}`,
    ),
  );

  const negotiationTexts: string[] = [];
  if (userData.muendlicheVerhandlung === "on") {
    negotiationTexts.push(
      "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nr. 4 ZPO anzuberaumen.",
    );
  }
  if (userData.videoverhandlung === "yes") {
    negotiationTexts.push(
      "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß § 128a Absatz 3 ZPO wird beantragt.",
    );
  } else if (userData.videoverhandlung === "no") {
    negotiationTexts.push(
      "Gegen die Durchführung einer Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.",
    );
  }
  addSection("Mündliche Verhandlung/Videoverhandlung", negotiationTexts);

  addSection(
    "Versäumnisurteil",
    userData.versaeumnisurteil === "on"
      ? [
          "Sofern die gesetzlichen Voraussetzungen vorliegen, wird der Erlass eines Versäumnisurteils gemäß § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt.",
        ]
      : [],
  );
};
