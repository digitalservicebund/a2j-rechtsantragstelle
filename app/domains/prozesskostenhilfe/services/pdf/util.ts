import type PDFDocument from "pdfkit";
import { belegeStrings } from "~/domains/prozesskostenhilfe/formular/stringReplacements";
import type { FinancialEntry } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createHeading } from "~/services/pdf/createHeading";
import { pdfStyles } from "~/services/pdf/pdfStyles";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { type ProzesskostenhilfeFormularUserData } from "../../formular/userData";

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
          return betragNumber / 4;
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

export const getFinancialEntryMonthlyAverage = (
  financialEntry: FinancialEntry,
) => {
  const betragNumber = Number(
    financialEntry.betrag.replaceAll(".", "").replace(",", "."),
  );
  switch (financialEntry.zahlungsfrequenz) {
    case "monthly":
      return betragNumber;
    case "quarterly":
      return betragNumber / 4;
    case "one-time":
    case "yearly":
      return betragNumber / 12;
  }
};

export const buildBelegeList = ({
  doc,
  documentStruct,
  userData,
  translations,
}: {
  doc: typeof PDFDocument;
  documentStruct: PDFKit.PDFStructureElement;
  userData: ProzesskostenhilfeFormularUserData;
  translations?: Translations;
}) => {
  if (!translations) return;
  const conditions = belegeStrings(userData);
  if (userData.versandArt === "analog") {
    createHeading(doc, documentStruct, translations.belegeAnhangHeading, "H2");
  }
  doc.moveUp(1);
  doc
    .fontSize(pdfStyles.page.fontSize)
    .font(pdfStyles.page.font)
    .text(
      userData.versandArt === "analog"
        ? translations.belegeAnhangHeading
        : translations.belegeAnhangSubheadingOnline,
    )
    .moveDown(1);
  const belegeList = Object.entries(conditions)
    .filter(([, val]) => val === true)
    .map(([key]) => {
      const translationKey = `${key}Text`;
      return (
        translations[translationKey] ??
        `<Beleg String not found for ${translationKey}, please ensure a matching translation exists in Strapi>`
      );
    });
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
