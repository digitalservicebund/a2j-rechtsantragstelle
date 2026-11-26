import type PDFDocument from "pdfkit";
import {
  getKlagePartyCheckboxLabel,
  getSelectableKlageParties,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/bezifferteZahlungsUndNebenantraege/klageParteiCheckboxesHelpers";
import { getGesetzlicheVertretungArtLabel } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import { getOrderedKlageParties } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyOrdering";
import { getOrderedAbsaetze } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/beweisOrdering";
import type { Beweis } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addMissingData } from "./addMissingData";

const getBeweisPersonen = (
  beweis: Extract<Beweis, { type: "zeuge" | "parteivernehmung" }>,
  userData: GeldEinklagenAnwaltschaftUserData,
): Array<
  | { name: string; address: string }
  | { partyLabel: string; representative?: string }
> => {
  switch (beweis.type) {
    case "zeuge":
      return [
        {
          name: getFullPlaintiffName(
            beweis.anrede,
            beweis.titel,
            beweis.vorname,
            beweis.nachname,
          ),
          address: [
            [beweis.strasse, beweis.hausnummer].filter(Boolean).join(" "),
            [beweis.plz, beweis.ort].filter(Boolean).join(" "),
            beweis.land,
          ]
            .filter(Boolean)
            .join(", "),
        },
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
        .map(({ index, party, relationship, representative }) => ({
          partyLabel: [
            `${relationship === "klagende" ? "Kläger" : representative ? "Beklagtem" : "Beklagter"} zu ${index + 1})`,
            !representative && getKlagePartyCheckboxLabel(party),
          ]
            .filter(Boolean)
            .join(" "),
          representative: representative
            ? [
                getGesetzlicheVertretungArtLabel(representative.art),
                getFullPlaintiffName(
                  representative.anrede,
                  representative.titel,
                  representative.vorname,
                  representative.nachname,
                ),
              ]
                .filter(Boolean)
                .join(", ")
            : undefined,
        }));
  }
};

export const createBegruendung = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  const absaetze = getOrderedAbsaetze(userData);

  const section = doc.struct("Sect");
  documentStruct.add(section);
  section.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(18)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Begründung", PDF_MARGIN_HORIZONTAL);
      doc.moveDown();
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
    doc.moveDown();
  }

  let previousAntragKey: string | undefined;
  for (const { antrag, absatz, beweise } of absaetze) {
    const antragKey = antrag.key;
    if (antragKey !== previousAntragKey) {
      section.add(
        doc.struct("H3", {}, () => {
          let title = antrag.title;
          if (antrag.antragNumber !== undefined) {
            title = `zu Antrag ${antrag.antragNumber})`;
            if (antrag.nebenantragLabel) {
              title += ` – ${antrag.nebenantragLabel}`;
            }
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
            for (const person of personen) {
              doc.font(FONTS_BUNDESSANS_REGULAR);
              if ("partyLabel" in person) {
                if (person.representative !== undefined) {
                  doc
                    .text(
                      `\u2022 Gesetzliche Vertretung von ${person.partyLabel}`,
                      evidenceX + 8,
                    )
                    .font(FONTS_BUNDESSANS_BOLD)
                    .text(person.representative, evidenceX + 16);
                } else {
                  doc
                    .text("\u2022 ", evidenceX + 8, undefined, {
                      continued: true,
                    })
                    .font(FONTS_BUNDESSANS_BOLD)
                    .text(person.partyLabel);
                }
              } else if (!person.name) {
                doc.text(`\u2022 ${person.address}`, evidenceX + 8);
              } else {
                doc
                  .text("\u2022 ", evidenceX + 8, undefined, {
                    continued: true,
                  })
                  .font(FONTS_BUNDESSANS_BOLD);
                if (person.address) {
                  doc
                    .text(person.name, { continued: true })
                    .font(FONTS_BUNDESSANS_REGULAR)
                    .text(`, ${person.address}`);
                } else {
                  doc.text(person.name);
                }
              }
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
