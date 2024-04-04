import type { UnterhaltPdfField } from "./unterhaltPdfField";

export function getAttachmentText(
  listKinderUnterhaltPdfField: UnterhaltPdfField[],
  listPersonUnterhaltPdfField: UnterhaltPdfField[],
): string {
  let attachmentText = "";

  if (listKinderUnterhaltPdfField.length > 0) {
    attachmentText += `Kinder:\n\n`;
    listKinderUnterhaltPdfField.forEach((kind, index) => {
      attachmentText += `Kind ${index + 1}:\n`;
      attachmentText += getUnterhaltDescription(kind);
      attachmentText += "\n\n";
    });
  }

  if (listPersonUnterhaltPdfField.length > 0) {
    attachmentText += "\n\n";
    attachmentText += "Unterhaltszahlungen für andere Angehörige\n\n";
    listPersonUnterhaltPdfField.forEach((partner, index) => {
      attachmentText += `Person ${index + 1}:\n`;
      attachmentText += getUnterhaltDescription(partner);
      attachmentText += "\n\n";
    });
  }

  return attachmentText;
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
  if (familienverhaeltnis != "Mein Kind")
    description.push(`Familienverhältnis: ${familienverhaeltnis}`);
  description.push(
    `Monatliche Unterhaltszahlungen: ${unterhaltSumme ? unterhaltSumme + " €" : "Keine Angabe"}`,
  );
  description.push(`Gemeinsame Wohnung: ${lebenZusammen ? "Ja" : "Nein"}`);

  return description.join("\n");
}
