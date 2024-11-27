import type PDFDocument from "pdfkit";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { belegeStrings } from "~/domains/prozesskostenhilfe/formular/stringReplacements";
import type { FinancialEntry } from "~/domains/shared/formular/finanzielleAngaben/context";
import { createHeading } from "~/services/pdf/createHeading";
import { pdfStyles } from "~/services/pdf/pdfStyles";
import type { Translations } from "~/services/translations/getTranslationByKey";

export const getTotalMonthlyFinancialEntries = (
  financialEntries: FinancialEntry[],
) =>
  financialEntries
    .map((entry) => {
      const betragNumber = Number(
        entry.betrag.replaceAll(".", "").replace(",", "."),
      );
      switch (entry.zahlungsfrequenz) {
        case "monthly":
          return betragNumber;
        case "quarterly":
          return betragNumber / 3;
        case "one-time":
          return betragNumber / 12;
        case "yearly":
          return betragNumber / 12;
      }
    })
    .reduce((a, b) => a + b, 0)
    .toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

export const buildBelegeList = ({
  doc,
  documentStruct,
  userData,
  translations,
}: {
  doc: typeof PDFDocument;
  documentStruct: PDFKit.PDFStructureElement;
  userData: ProzesskostenhilfeFormularContext;
  translations?: Translations;
}) => {
  if (!translations) return;
  const conditions = belegeStrings(userData);
  createHeading(doc, documentStruct, translations.belegeAnhangHeading, "H2");
  doc.moveUp(1);
  doc
    .fontSize(pdfStyles.page.fontSize)
    .font(pdfStyles.page.font)
    .text(translations.belegeAnhangSubheading)
    .moveDown(1);
  const belegeList = Object.entries(conditions)
    .filter(([, val]) => val === true)
    .map(([key]) => translations[`${key}Text`]);
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc.list(belegeList, {
        bulletRadius: 2,
        paragraphGap: 8,
        indent: pdfStyles.list.paddingLeft,
      });
    }),
  );
};
