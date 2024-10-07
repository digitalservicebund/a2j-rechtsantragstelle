import { type LoaderFunction } from "@remix-run/node";
import PDFDocument from "pdfkit";
import { readRelativeFileToBuffer } from "~/services/pdf/fillPdf.server";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/fluggastrechte/createPdfKitDocument";

const BundesSansWebRegularBuffer = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Regular.woff",
);
const BundesSansWebBoldBuffer = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Bold.woff",
);

const generatePDF = (doc: typeof PDFDocument) => {
  doc.version = 1.7;

  doc.registerFont(FONTS_BUNDESSANS_REGULAR, BundesSansWebRegularBuffer);
  doc.registerFont(FONTS_BUNDESSANS_BOLD, BundesSansWebBoldBuffer);

  // Add metadata
  doc.info.Title = "Klage";
  doc.info.Author = "Zugang zu Recht";
  doc.info.Subject = "Klageschrift";
  doc.info.Keywords = "Fluggastrechte";
  doc.info.CreationDate = new Date(Date.now());
  doc.info.Creator = "DigitalService GmbH des Bundes";

  // Top-level structure for the entire document
  const documentStruct = doc.struct("Document");
  doc.addStructure(documentStruct);

  // Amtsgericht Section
  const amtsgerichtHeaderSect = doc.struct("Sect");
  amtsgerichtHeaderSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("An das", { align: "left" });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Amtsgericht Königs Wusterhausen", { align: "left" });
      doc.text("Schlossplatz 4", { align: "left" });
      doc.text("15711 Königs Wusterhausen", { align: "left" });
    }),
  );
  documentStruct.add(amtsgerichtHeaderSect);

  doc.moveDown(3);

  // Klage Section
  const klageHeaderSect = doc.struct("Sect");
  klageHeaderSect.add(
    doc.struct("H1", {}, () => {
      doc
        .fontSize(31)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Klage", { align: "left" });
    }),
  );
  klageHeaderSect.add(
    doc.struct("P", {}, () => {
      doc.fontSize(10).font(FONTS_BUNDESSANS_REGULAR).text("Neueingang");
    }),
  );
  documentStruct.add(klageHeaderSect);

  doc.moveDown(2);

  // In der Sache Section
  const inDerSacheSect = doc.struct("Sect");
  inDerSacheSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("in der Sache");
    }),
  );
  documentStruct.add(inDerSacheSect);

  // Plaintiff information (Bold name)
  const plaintiffSect = doc.struct("Sect");
  plaintiffSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Włodzimierz Ciesiński", { continued: true });
      doc
        .font("FONTS_BUNDESSANS_REGULAR")
        .text(" | Musterstr. 3, 12345 Musterhausen");
      doc.text("0176 30441234");
      doc.text("– Klagende Partei –", { align: "left" });
    }),
  );
  documentStruct.add(plaintiffSect);

  // More padding before "Gegen"
  doc.moveDown(2);

  // "Gegen" Section
  const gegenSect = doc.struct("Sect");
  gegenSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("gegen", { align: "left" });
    }),
  );
  documentStruct.add(gegenSect);
  doc.moveDown(1);

  // Defendant information (Bold company name)
  const defendantSect = doc.struct("Sect");
  defendantSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Deutsche Lufthansa Aktiengesellschaft", { continued: true });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(" | Venloer Straße 151-153, 50672 Köln");
      doc.text("– Beklagte Partei –");
    }),
  );
  documentStruct.add(defendantSect);

  // More padding before details
  doc.moveDown(2);

  // Flight claim details (Bold)
  const claimDetailsSect = doc.struct("Sect");
  claimDetailsSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004",
        );
      doc.font(FONTS_BUNDESSANS_BOLD).text("Betroffener Flug:");
      doc.moveDown(0.2);
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Flugnummer:", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(" AB1234");
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Geplantes Abflugdatum:", { continued: true })
        .font(FONTS_BUNDESSANS_BOLD)
        .text(" 10.03.2024");
      doc.fontSize(12).font(FONTS_BUNDESSANS_BOLD).text("Streitwert: 500€");
    }),
  );
  documentStruct.add(claimDetailsSect);

  // More padding before "Klageantrag"
  doc.moveDown(2);

  // "Klageantrag" Section
  const klageantragSect = doc.struct("Sect");
  klageantragSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("Klageantrag");
    }),
  );
  klageantragSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("Die klagende Partei erhebt Antrag,");
      doc.list(
        [
          "die beklagte Partei zu verurteilen, an die klagende Partei {Total Summe} € {nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit} zu zahlen.",
          "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
        ],
        { indent: 5, textIndent: 10, listType: "bullet" },
      );
    }),
  );
  documentStruct.add(klageantragSect);

  // Additional text
  const additionalTextSect = doc.struct("Sect");
  additionalTextSect.add(
    doc.struct("P", {}, () => {
      doc.text(`
        {Sofern das Gericht das schriftliche Vorverfahren anordnet, wird für den Fall der Fristversäumnis beantragt, die beklagte Partei durch Versäumnisurteil ohne mündliche Verhandlung (§ 331 ZPO).}
        Mit einer Entscheidung im schriftlichen Verfahren ohne mündliche Verhandlung (§ 128 Abs. 2 ZPO) sowie der Durchführung einer Videoverhandlung (§ 128a ZPO) bin ich einverstanden.
      `);
    }),
  );
  documentStruct.add(additionalTextSect);

  // Signature and IBAN placeholderI
  const signatureSect = doc.struct("Sect");
  signatureSect.add(
    doc.struct("P", {}, () => {
      doc.moveDown(7.5);
      doc.text("Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX");
    }),
  );
  documentStruct.add(signatureSect);

  // Artifact Section for the stamp
  const artifactSect = doc.struct("Sect");
  artifactSect.add(
    doc.struct("P", {}, () => {
      // Add the box and vertical stamp on the left
      const stampTextWidth = 188;
      const stampTextHeight = 20;
      const stampText =
        "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

      // Draw text
      doc.rotate(-90, { origin: [50, 780] }); // Adjusted origin to 30px
      doc
        .fontSize(7) // Adjusted font size to 7
        .text(stampText, stampTextHeight * 2, 760, {
          align: "center",
          width: stampTextWidth,
          baseline: "middle",
        }); // Adjusted x coordinate to 30px

      // Ensure the box is 188px x 20px
      doc
        .rect(stampTextHeight * 2, 750, stampTextWidth, stampTextHeight)
        .stroke(); // Adjusted x coordinate to 30px
    }),
  );
  documentStruct.add(artifactSect);

  // End the top-level document structure
  documentStruct.end();

  // Finalize the PDF file
  doc.end();
  return doc;
};

// Function to create a buffer from the PDF document
const createPDFBuffer = (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      pdfVersion: "1.7",
      lang: "de-DE",
      tagged: true,
      displayTitle: true,
      size: "A4",
      margin: 70,
      fontLayoutCache: true,
      subset: "PDF/UA" as PDFKit.Mixins.PDFSubsets, // PDFKit uses DefinitelyTyped and it's not updated yet
      permissions: {
        annotating: true,
        printing: "highResolution",
        fillingForms: true,
        contentAccessibility: true,
      },
    });

    const chunks: Uint8Array[] = [];

    // Collect PDF chunks
    doc.on("data", (chunk) => chunks.push(chunk));

    // Handle the error event
    doc.on("error", (err) => {
      reject(new Error(`PDF generation error: ${err.message}`));
    });

    // Resolve the promise when the PDF generation is finished
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    // Generate the PDF content
    generatePDF(doc);
  });
};

// Remix loader to return the generated PDF as response
export const loader: LoaderFunction = async () => {
  const pdfBuffer = await createPDFBuffer();

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=klageschrift.pdf", // 'inline' displays the PDF in the browser
      "Content-Length": pdfBuffer.length.toString(), // Add content length
    },
  });
};
