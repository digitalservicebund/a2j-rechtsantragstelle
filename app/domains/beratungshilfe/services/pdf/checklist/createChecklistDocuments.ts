import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { beratungshilfeFormular } from "~/domains/beratungshilfe/formular";
import { pdfStyles } from "~/domains/shared/pdf/pdfStyles";
import {
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

const { stringReplacements } = beratungshilfeFormular;
type ReplacementKey = keyof ReturnType<typeof stringReplacements>;

const documents = {
  hasBuergergeld: "Ihren aktuellen Bürgergeld-Bescheid",
  hasBuergergeldOrNoSozialleistung: "Kontoauszüge der letzten 3 Monate",
  staatlicheLeistungenIsGrundsicherung:
    "Ihren aktuellen Bescheid über Grundsicherung oder Sozialhilfe",
  arbeitslosenGeld: "Kopie Ihres aktuellen Arbeitslosengeld-Bescheids",
  staatlicheLeistungenIsAsylbewerberleistungen:
    "Ihren aktuellen Bescheid über Asylbewerberleistungen",
  wohngeld: "Kopie Ihres aktuellen Wohngeld-Bescheids",
  bafoeg:
    "Kopie Ihres aktuellen Bescheids über Bafoeg- oder Ausbildungsförderung",
  krankengeld:
    "Kopie Ihres Bescheids über Kranken- oder Pflegegeld (wenn vorhanden)",
  elterngeld: "Kopie Ihres aktuellen Elterngeld-Bescheids",
  hasLebensversicherung:
    "Kopie des letzten Jahreskontoauszugs für Ihre Lebensversicherung",
  hasBausparvertrag:
    "Kopie des letzten Jahreskontoauszugs für Ihren Bausparvertrag",
  hasWertpapiere:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Wertpapier-Depot",
  hasGutenhabenKrypto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Paypal-, Krypto- oder anderem Guthaben-Konto",
  hasGiroTagesSparkonto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Giro-, Tagesgeld- oder Sparkonto",
  hasGrundeigentum: "Kopie des Grundbuchauszugs von Ihrem Grundeigentum",
  hasSchwangerschaft: "Angabe des voraussichtlichen Entbindungstermins",
  hasSchwerbehinderung:
    "Kopie des Schwerbehindertensuasweis, oder Nachweis über die Behinderung",
  hasMedicalReasons:
    "Bescheinigung der medizinischen Notwendigkeit der kostenaufwändigen Ernährung",
  hasWeitereAusgaben:
    "Unterlagen, die Ihre Ausgaben belegen, wenn diese nicht auf den Kontoauszügen zu sehen sind",
} as const satisfies Partial<Record<ReplacementKey, string>>;

export const createChecklistDocuments = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: BeratungshilfeFormularContext,
) => {
  const conditions = stringReplacements(userData);

  const relevantDocuments = [
    "Unterlagen zu Ihrem rechtlichen Problem",
    "Kopie Ihres aktuellen Mietvertrags",
    ...Object.keys(documents)
      .filter((key) => conditions[key as ReplacementKey])
      .map((key) => documents[key as keyof typeof documents]),
  ] as const;

  const checklistDocumentsSect = doc.struct("Sect");

  checklistDocumentsSect.add(
    doc.struct("L", {}, () => {
      doc
        .moveDown(1.5)
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .list(
          relevantDocuments.map((doc) => doc),
          { paragraphGap: 8, indent: pdfStyles.list.paddingLeft },
        );
    }),
  );

  doc.markContent("Artifact");
  doc
    .rect(
      PDF_MARGIN_HORIZONTAL + pdfStyles.sectionIndented.paddingLeft,
      doc.y + 10,
      doc.page.width -
        (PDF_MARGIN_HORIZONTAL + pdfStyles.sectionIndented.paddingLeft) * 2,
      (relevantDocuments.length + 1) * (pdfStyles.page.fontSize + 10),
    )
    .stroke();
  doc.endMarkedContent();

  documentStruct.add(checklistDocumentsSect);
};
