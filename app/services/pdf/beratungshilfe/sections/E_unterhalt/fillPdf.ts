import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { UnterhaltPdfField } from "./unterhaltPdfField";

export function fillPdf(
  listKinderUnterhaltPdfField: UnterhaltPdfField[],
  listPartnerUnterhaltPdfField: UnterhaltPdfField[],
  pdfFields: BeratungshilfePDF,
) {
  [...listPartnerUnterhaltPdfField, ...listKinderUnterhaltPdfField].forEach(
    (field, idx) => fillPersonInPdf(pdfFields, field, idx),
  );
}

function fillPersonInPdf(
  pdfFields: BeratungshilfePDF,
  unterhaltPdfFields: UnterhaltPdfField,
  index: number,
) {
  const nameKey = `e1Person${index + 1}` as keyof BeratungshilfePDF;
  const birthdayKey =
    `e2Geburtsdatum${index === 0 ? "" : index + 1}` as keyof BeratungshilfePDF;
  const relationKey =
    `e3Familienverhaeltnis${index === 0 ? "" : index + 1}` as keyof BeratungshilfePDF;
  const unterhaltKey = `e4Zahlung${index + 1}` as keyof BeratungshilfePDF;
  const einnahmenKey = `e5Einnahmen${index + 1}` as keyof BeratungshilfePDF;
  const einnahmenSummeKey = `e6Betrag${index + 1}` as keyof BeratungshilfePDF;

  if (nameKey in pdfFields)
    pdfFields[nameKey].value =
      unterhaltPdfFields.name +
      (unterhaltPdfFields.lebenZusammen ? "" : " (Gemeinsame Wohnung: Nein)");
  if (birthdayKey in pdfFields)
    pdfFields[birthdayKey].value = unterhaltPdfFields.geburtsdatum;
  if (relationKey in pdfFields)
    pdfFields[relationKey].value = unterhaltPdfFields.familienverhaeltnis;
  if (unterhaltKey in pdfFields)
    pdfFields[unterhaltKey].value =
      unterhaltPdfFields.unterhaltSumme &&
      unterhaltPdfFields.unterhaltSumme + " €";
  if (einnahmenKey in pdfFields)
    pdfFields[einnahmenKey].value = !unterhaltPdfFields.hatEinnahmen;
  if (einnahmenSummeKey in pdfFields)
    pdfFields[einnahmenSummeKey].value =
      unterhaltPdfFields.einnahmenSumme &&
      unterhaltPdfFields.einnahmenSumme + " €";
}
