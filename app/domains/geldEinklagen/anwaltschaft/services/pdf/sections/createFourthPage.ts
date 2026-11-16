import type PDFDocument from "pdfkit";
import { getSelectableKlageParties } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";
import { getOrderedKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import {
  getBeweisTitle,
  getParteivernehmungBeweisCheckboxLabel,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
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

const getBeweisText = (
  beweis: Beweis,
  userData: GeldEinklagenAnwaltschaftUserData,
): string => {
  switch (beweis.type) {
    case "zeuge":
      return [
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
        .join("\n");
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
        )
        .join("\n");
    default:
      return beweis.beschreibung;
  }
};

export const createFourthPage = (
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

  doc.fontSize(12).text("I. Sachverhalt");
  doc.moveDown(2);

  if (!absaetze.some(({ absatz }) => absatz.formulierung.trim())) {
    addMissingData(doc, section, "Sachverhalt");
    doc.moveDown(2);
  }

  let previousAntragKey: string | undefined;
  for (const { antrag, absatz, beweise } of absaetze) {
    if (antrag.key !== previousAntragKey) {
      section.add(
        doc.struct("H3", {}, () => {
          let title = antrag.title;
          if (antrag.kind === "prozessantrag") {
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
      previousAntragKey = antrag.key;
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
    for (const { beweis, documentNumber } of beweise) {
      const title = getBeweisTitle(beweis.type, documentNumber, true);
      if (title === undefined) {
        throw new Error(`Missing PDF evidence title for ${beweis.type}`);
      }
      section.add(
        doc.struct("P", {}, () => {
          doc
            .fontSize(10)
            .font(FONTS_BUNDESSANS_BOLD)
            .text(title, PDF_MARGIN_HORIZONTAL)
            .font(FONTS_BUNDESSANS_REGULAR)
            .text(getBeweisText(beweis, userData), PDF_MARGIN_HORIZONTAL);
          doc.moveDown(0.5);
        }),
      );
    }
    doc.moveDown(2);
  }
};
