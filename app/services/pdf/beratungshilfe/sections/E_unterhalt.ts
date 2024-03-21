import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { Attachment } from "../attachment";

type UnterhaltPdfField = {
  name: string;
  geburtsdatum?: string;
  familienverhaeltnis: "Kind" | "Partner:in";
  unterhaltSumme?: string;
  hatEinnahmen: boolean;
  einnahmenSumme?: string;
  lebenZusammen?: boolean;
};

export function fillUnterhalt(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const partner: UnterhaltPdfField | undefined =
    context.partnerschaft === "yes" && context.unterhalt === "yes"
      ? {
          name: `${context.partnerVorname ?? ""} ${context.partnerNachname ?? ""}`,
          familienverhaeltnis: "Partner:in",
          unterhaltSumme: context.unterhaltsSumme,
          hatEinnahmen: context.partnerEinkommen === "yes",
          einnahmenSumme: context.partnerEinkommen,
          lebenZusammen: context.zusammenleben === "yes",
        }
      : undefined;

  const kinder: UnterhaltPdfField[] = context.kinder
    ? context.kinder.map((kind) => ({
        name: `${kind.vorname ?? ""} ${kind.nachname ?? ""}`,
        geburtsdatum: kind.geburtsdatum,
        familienverhaeltnis: "Kind",
        unterhaltSumme: kind.unterhaltsSumme,
        hatEinnahmen: kind.eigeneEinnahmen === "yes",
        einnahmenSumme: kind.einnahmen,
        lebenZusammen: kind.wohnortBeiAntragsteller === "yes",
      }))
    : [];

  [partner, ...kinder]
    .filter(Boolean)
    .forEach((field, idx) =>
      fillPersonInPdf(pdfFields, field as UnterhaltPdfField, idx),
    );

  if (!partner && kinder.length === 0) return;

  attachment.shouldCreateAttachment = true;

  let attachmentText = "";

  if (kinder.length > 0) {
    attachmentText += `Kinder:\n\n`;
    kinder.forEach((kind, index) => {
      attachmentText += `Kind ${index + 1}:\n`;
      attachmentText += getUnterhaltDescription(kind);
      attachmentText += "\n\n";
    });
  }

  if (partner) {
    attachmentText += "\n\n";
    attachmentText += "Unterhaltszahlungen für andere Angehörige\n\n";
    attachmentText += getUnterhaltDescription(partner);
  }

  attachment.descriptions.push({
    title: "Feld E Unterhaltszahlungen",
    text: attachmentText,
  });
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

function getUnterhaltDescription({
  name,
  unterhaltSumme,
  geburtsdatum,
  lebenZusammen,
  einnahmenSumme,
  familienverhaeltnis,
  hatEinnahmen,
}: UnterhaltPdfField) {
  const description = [];

  description.push(`Name: ${name ?? ""}`);
  description.push(`Geburtsdatum: ${geburtsdatum ?? ""}`);
  if (hatEinnahmen && einnahmenSumme)
    description.push(`Eigene monatlichen Einnahmen: ${einnahmenSumme} €`);
  if (familienverhaeltnis === "Partner:in")
    description.push(`Familienverhältnis: ${familienverhaeltnis}`);
  description.push(
    `Monatliche Unterhaltszahlungen: ${unterhaltSumme ? unterhaltSumme + " €" : "Keine Angabe"}`,
  );
  description.push(`Gemeinsame Wohnung: ${lebenZusammen ? "Ja" : "Nein"}`);

  return description.join("\n");
}
