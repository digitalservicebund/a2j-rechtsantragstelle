import fs from "fs";
import PDFDocument from "pdfkit";
import {
  beratungshilfeFormular,
  BeratungshilfeFormularContext,
} from "~/flows/beratungshilfeFormular";
import { styles } from "../attachment/styles";

const { stringReplacements } = beratungshilfeFormular;
type ReplacementKey = keyof ReturnType<typeof stringReplacements>;

const documents = {
  hasBuergergeld: "Ihren aktuellen Bürgergeld-Bescheid",
  hasBuergergeldOrNoSozialleistung: "Kontoauszüge der letzten 3 Monate",
  hasGrundsicherung:
    "Ihren aktuellen Bescheid über Grundsicherung oder Sozialhilfe",
  arbeitslosenGeld: "Kopie Ihres aktuellen Arbeitslosengeld-Bescheids",
  hasAsylbewerberleistungen:
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

export async function generateHandout(
  userdata: BeratungshilfeFormularContext,
  footer: string,
) {
  const conditions = stringReplacements(userdata);

  const relevantDocuments = [
    "Unterlagen zu Ihrem rechtlichen Problem",
    "Kopie Ihres aktuellen Mietvertrags",
    ...Object.keys(documents)
      .filter((key) => conditions[key as ReplacementKey])
      .map((key) => documents[key as keyof typeof documents]),
  ] as const;

  const doc = new PDFDocument({
    size: "A4",
    // TODO: read margins from styles
    margins: {
      top: 48,
      bottom: 72,
      left: 66,
      right: 72,
    },
  });
  doc.pipe(fs.createWriteStream("./app/services/pdf/attachment/handout.pdf"));

  const section = doc.struct("Sect");
  doc.addStructure(section);

  doc.markContent("Span");
  doc
    .fontSize(styles.pageHeader.fontSize)
    .font("Helvetica-Bold")
    .text(
      `Merkblatt: Antrag auf Bewilligung von Beratungshilfe von ${userdata.vorname} ${userdata.nachname}`,
      {
        structParent: section,
        structType: "P",
      },
    );
  doc.endMarkedContent();

  doc
    .fontSize(styles.h1.fontSize)
    .font("Helvetica-Bold")
    .text("Ihre nächsten Schritte", {
      structParent: section,
      structType: "H1",
    });
  doc
    .fontSize(styles.h2.fontSize)
    .font("Helvetica-Bold")
    .text("So schicken Sie den Antrag ins Amtsgericht", {
      structParent: section,
      structType: "H2",
    });
  doc
    .fontSize(styles.h3.fontSize)
    .font("Helvetica-Bold")
    .text("1. Antrag ausdrucken", {
      structParent: section,
      structType: "H3",
    });
  doc
    .fontSize(styles.h3.fontSize)
    .font("Helvetica-Bold")
    .text("2. Antrag unterschreiben", {
      structParent: section,
      structType: "H3",
    });
  doc
    .fontSize(styles.page.fontSize)
    .font("Helvetica")
    .text(
      "Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld “Unterschrift des Antragstellers/der Antragstellerin”",
      {
        indent: styles.sectionIndented.paddingLeft,
        structParent: section,
        structType: "P",
      },
    );

  doc
    .fontSize(styles.h3.fontSize)
    .font("Helvetica-Bold")
    .text("3. Benötigte Dokumente kopieren", {
      structParent: section,
      structType: "H3",
    });
  doc
    .fontSize(styles.page.fontSize)
    .font("Helvetica")
    .text("Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:", {
      indent: styles.sectionIndented.paddingLeft,
      structParent: section,
      structType: "P",
    });

  doc.markContent("Artifact");
  doc.rect(doc.x, doc.y, 410, relevantDocuments.length * 20 + 20).stroke();
  doc.endMarkedContent();

  // This section is commented, because the list items are not structured content
  // const list = doc.struct("List");
  // doc.list(
  //   relevantDocuments.map((doc) => doc),
  //   { structParent: list, paragraphGap: 8 },
  // );

  doc
    .fontSize(styles.h3.fontSize)
    .font("Helvetica-Bold")
    .text("4. Antrag abgeben", {
      structParent: section,
      structType: "H3",
    });
  doc
    .fontSize(styles.page.fontSize)
    .font("Helvetica")
    .text(
      `Sie können den Antrag direkt im Amtsgericht abgeben oder per Post schicken. ${
        conditions.courtName
          ? "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld."
          : "Ihr zuständiges Amtsgericht finden Sie über den Service 'Amtsgericht finden' auf https://service.justiz.de/beratungshilfe."
      }`,
      {
        indent: styles.sectionIndented.paddingLeft,
        structParent: section,
        structType: "P",
      },
    );

  doc.markContent("Span");
  doc
    .fontSize(10)
    .text(footer + "1/1", doc.page.width - 72, doc.page.height - 66, {
      structParent: section,
      structType: "P",
    });
  doc.endMarkedContent();

  doc.end();
}
