import { type LoaderFunction } from "@remix-run/node";
import PDFDocument from "pdfkit";
import { readRelativeFileToBuffer } from "~/services/pdf/fillPdf.server";

const BundesSansWebRegular = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Regular.woff",
);
const BundesSansWebBold = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Bold.woff",
);

const generatePDF = (doc: typeof PDFDocument) => {
  doc.version = 1.7;

  doc.registerFont("BundesSansWebRegular", BundesSansWebRegular);
  doc.registerFont("BundesSansWebBold", BundesSansWebBold);

  // Add metadata
  doc.info.Title = "Klage";
  doc.info.Author = "Zugang zu Recht";
  doc.info.Subject = "Klageschrift";
  doc.info.Keywords = "Fluggastrechte";
  doc.info.CreationDate = new Date(Date.now());
  doc.info.Creator = "DigitalService GmbH des Bundes";

  // "An das" section (Bold)
  const myStruct = doc.struct("P");
  doc.addStructure(myStruct);
  const myStructContent = doc.markStructureContent("P");
  doc.fontSize(10).font("BundesSansWebBold").text("An das", { align: "left" });
  doc
    .font("BundesSansWebRegular")
    .text("Amtsgericht Königs Wusterhausen", { align: "left" });
  doc.text("Schlossplatz 4", { align: "left" });
  doc.text("15711 Königs Wusterhausen", { align: "left" });
  doc.endMarkedContent();
  myStruct.add(myStructContent);
  myStruct.end();

  // Title and introduction
  doc.moveDown(3);
  doc.fontSize(31).font(BundesSansWebBold).text("Klage", { align: "left" });
  doc
    .fontSize(10)
    .font(BundesSansWebRegular)
    .text("Neueingang über service.justiz.de");

  doc.moveDown(2);

  // "In der Sache" (Bold)
  doc.fontSize(14).font(BundesSansWebBold).text("in der Sache");
  doc.moveDown();

  // Plaintiff information (Bold name)
  doc
    .fontSize(10)
    .font(BundesSansWebBold)
    .text("Włodzimierz Ciesiński", { continued: true });
  doc.font(BundesSansWebRegular).text(" | Musterstr. 3, 12345 Musterhausen");
  doc.text("0176 30441234");
  doc.text("– Klagende Partei –", { align: "left" });

  // More padding before "Gegen"
  doc.moveDown(2);

  // "Gegen" (Bold, larger, with more padding)
  doc.fontSize(14).font(BundesSansWebBold).text("gegen", { align: "left" });
  doc.moveDown(1);

  // Defendant information (Bold company name)
  doc
    .fontSize(10)
    .font(BundesSansWebBold)
    .text("Deutsche Lufthansa Aktiengesellschaft", { continued: true });
  doc.font(BundesSansWebRegular).text(" | Venloer Straße 151-153, 50672 Köln");
  doc.text("– Beklagte Partei –");

  // More padding before details
  doc.moveDown(2);

  // Flight claim details (Bold)
  doc
    .fontSize(12)
    .font(BundesSansWebBold)
    .text(
      "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004",
    );
  doc.font(BundesSansWebBold).text("Betroffener Flug:");
  doc.moveDown(0.2);
  doc
    .fontSize(10)
    .font(BundesSansWebRegular)
    .text("Flugnummer:", { continued: true })
    .font(BundesSansWebBold)
    .text(" AB1234");
  doc
    .font(BundesSansWebRegular)
    .text("Geplantes Abflugdatum:", { continued: true })
    .font(BundesSansWebBold)
    .text(" 10.03.2024");
  doc.fontSize(12).font(BundesSansWebBold).text("Streitwert: 500€");

  // More padding before "Klageantrag"
  doc.moveDown(2);

  // "Klageantrag" (Bold and less padding between title and content)
  doc.fontSize(14).font(BundesSansWebBold).text("Klageantrag");
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font(BundesSansWebRegular)
    .text("Die klagende Partei erhebt Antrag,");
  doc.list(
    [
      "die beklagte Partei zu verurteilen, an die klagende Partei {Total Summe} € {nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit} zu zahlen.",
      "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
    ],
    { indent: 5, textIndent: 10, listType: "bullet" },
  );

  doc.text(`
  {Sofern das Gericht das schriftliche Vorverfahren anordnet, wird für den Fall der Fristversäumnis beantragt, die beklagte Partei durch Versäumnisurteil ohne mündliche Verhandlung zu verurteilen (§ 331 ZPO).}
  Mit einer Entscheidung im schriftlichen Verfahren ohne mündliche Verhandlung (§ 128 Abs. 2 ZPO) sowie der Durchführung einer Videoverhandlung (§ 128a ZPO) bin ich einverstanden.
    `);

  // Signature and IBAN placeholder
  doc.moveDown(7.5);
  doc.text("Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX");

  // Add the box and vertical stamp on the left
  const stampTextWidth = 188;
  const stampTextHeight = 20;
  const stampText = "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

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
  doc.rect(stampTextHeight * 2, 750, stampTextWidth, stampTextHeight).stroke(); // Adjusted x coordinate to 30px

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

    // Register fonts
    doc.registerFont("BundesSansWebRegular", BundesSansWebRegular);
    doc.registerFont("BundesSansWebBold", BundesSansWebBold);

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
