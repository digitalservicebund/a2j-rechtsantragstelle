import type PDFDocument from "pdfkit";
import { getSelectableKlageParties } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";
import { getOrderedKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import { getParteivernehmungBeweisCheckboxLabel } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { getOrderedAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/beweisOrdering";
import type { Beweis } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_SIZE_FORMAT,
} from "~/services/pdf/createPdfKitDocument";
import { getPdfText } from "./addHauptantraege";
import { addMissingData } from "./addMissingData";

const getBeweisPersonen = (
  beweis: Extract<Beweis, { type: "zeuge" | "parteivernehmung" }>,
  userData: GeldEinklagenAnwaltschaftUserData,
): string[] => {
  switch (beweis.type) {
    case "zeuge":
      return [
        [
          getFullPlaintiffName(
            beweis.anrede,
            beweis.titel,
            beweis.vorname,
            beweis.nachname,
          ),
          [beweis.strasse, beweis.hausnummer].filter(Boolean).join(" "),
          [beweis.plz, beweis.ort].filter(Boolean).join(" "),
          beweis.land,
        ]
          .filter(Boolean)
          .join(", "),
      ];
    case "parteivernehmung":
      return [
        ...getSelectableKlageParties(
          getOrderedKlageParties(userData, "klagende"),
          "klagende",
          true,
        ),
        ...getSelectableKlageParties(
          getOrderedKlageParties(userData, "beklagte"),
          "beklagte",
          true,
        ),
      ]
        .filter(({ id }) => beweis.personen[id] === "on")
        .map(({ index, party, relationship, representative }) =>
          getPdfText(
            getParteivernehmungBeweisCheckboxLabel(
              index,
              party,
              relationship,
              representative,
            ),
          ),
        );
  }
};

export const createBegruendung = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const absaetze = getOrderedAbsaetze(userData);

  doc.addPage({
    size: PDF_SIZE_FORMAT,
    margins: { ...doc.page.margins, bottom: 70 },
  });
  const section = doc.struct("Sect");
  documentStruct.add(section);
  section.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(18)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Begründung", PDF_MARGIN_HORIZONTAL);
      doc.moveDown(1);
    }),
  );

  section.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(12)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("I. Sachverhalt", PDF_MARGIN_HORIZONTAL);
      doc.moveDown(0.5);
    }),
  );

  if (!absaetze.some(({ absatz }) => absatz.formulierung.trim())) {
    addMissingData(doc, section, "Sachverhalt");
    doc.moveDown(2);
  }

  let previousAntragKey: string | number | undefined;
  for (const { antrag, absatz, beweise } of absaetze) {
    const antragKey = antrag.antragNumber ?? antrag.key;
    if (antragKey !== previousAntragKey) {
      section.add(
        doc.struct("H3", {}, () => {
          let title = antrag.title;
          if (antrag.antragNumber !== undefined) {
            title = `zu Antrag ${antrag.antragNumber}`;
          } else if (antrag.kind === "prozessantrag") {
            if (antrag.antragId === "bedenkenVideoverhandlung") {
              title =
                "zu prozessualer Ausführung – Bedenken gegen Videoverhandlung";
            } else if (antrag.antragId === "videoverhandlung") {
              title = "zu Prozessantrag – Videoverhandlung";
            } else {
              title = `zu ${antrag.title}`;
            }
          }
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_BOLD)
            .text(title, PDF_MARGIN_HORIZONTAL);
          doc.moveDown(0.5);
        }),
      );
      previousAntragKey = antragKey;
    }
    section.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(absatz.formulierung, PDF_MARGIN_HORIZONTAL);
        doc.moveDown(0.5);
      }),
    );
    const printedPersonTypes = new Set<"zeuge" | "parteivernehmung">();
    for (const { beweis, documentNumber } of beweise) {
      const evidenceX = PDF_MARGIN_HORIZONTAL + 16;
      if (beweis.type === "zeuge" || beweis.type === "parteivernehmung") {
        if (printedPersonTypes.has(beweis.type)) continue;
        printedPersonTypes.add(beweis.type);
        const personen = beweise.flatMap(({ beweis: item }) =>
          (item.type === "zeuge" || item.type === "parteivernehmung") &&
          item.type === beweis.type
            ? getBeweisPersonen(item, userData)
            : [],
        );
        const title =
          beweis.type === "zeuge"
            ? "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:"
            : "Beweis angeboten durch Parteivernehmung der folgenden Personen:";
        section.add(
          doc.struct("P", {}, () => {
            doc.fontSize(10).font(FONTS_BUNDESSANS_BOLD).text(title, evidenceX);
            doc.font(FONTS_BUNDESSANS_REGULAR);
            for (const person of personen) {
              doc.text(`\u2022 ${person}`, evidenceX + 8);
            }
            doc.moveDown(0.5);
          }),
        );
      } else {
        if (documentNumber === undefined) {
          throw new Error("Missing document number for document evidence");
        }
        section.add(
          doc.struct("P", {}, () => {
            doc
              .fontSize(10)
              .font(FONTS_BUNDESSANS_BOLD)
              .text(`Beweis (K${documentNumber}): `, evidenceX, undefined, {
                continued: true,
              })
              .font(FONTS_BUNDESSANS_REGULAR)
              .text(beweis.beschreibung);
            doc.moveDown(0.5);
          }),
        );
      }
    }
    doc.moveDown(0.5);
  }
};
