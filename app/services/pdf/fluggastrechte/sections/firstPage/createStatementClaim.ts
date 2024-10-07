import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

const DEFENDANT_PARTY_LIST: Array<string> = [
  "die beklagte Partei zu verurteilen, an die klagende Partei 100 € nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit zu zahlen.",
  "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
];

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const statementClaimSect = doc.struct("Sect");
  statementClaimSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("Klageantrag");
    }),
  );

  doc.moveDown(1);

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Die klagende Partei erhebt Antrag,");
      doc.list(DEFENDANT_PARTY_LIST, {
        indent: 5,
        textIndent: 10,
        listType: "numbered",
      });

      doc.moveDown(1);

      doc.text(
        "Sofern das Gericht das schriftliche Vorverfahren anordnet, wird für den Fall der Fristversäumnis beantragt, die beklagte Partei durch Versäumnisurteil ohne mündliche Verhandlung zu verurteilen (§ 331 ZPO).",
      );
      doc.text(
        "Mit einer Entscheidung im schriftlichen Verfahren ohne mündliche Verhandlung (§ 128 Abs. 2 ZPO) sowie der Durchführung einer Videoverhandlung (§ 128a ZPO) bin ich einverstanden.",
      );
    }),
  );
  documentStruct.add(statementClaimSect);
};
