import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import type { AttachmentEntries } from "../../attachment";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E: Unterhaltszahlungen";
export const SEE_IN_ATTACHMENT_DESCRIPTION = "Siehe Anhang";

const familyRelationshipMap = {
  mother: "Meine Mutter",
  father: "Mein Vater",
  grandmother: "Meine Großmutter",
  grandfather: "Mein Großvater",
  kid: "Mein Kind",
  "ex-spouse-f": "Meine Ex-Ehepartnerin",
  "ex-spouse-m": "Mein Ex-Ehepartner",
  grandchild: "Mein Enkelkind",
} as const;

export function fillUnterhalt(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const zahltPartnerUnterhalt = context.unterhaltsSumme !== undefined;
  const kinder = context.kinder ?? [];
  const hasKinder = kinder.length > 0;

  const unterhaltszahlungen = context.unterhaltszahlungen ?? [];
  const hasUnterhaltszahlungen = unterhaltszahlungen.length > 0;

  if (!zahltPartnerUnterhalt && !hasUnterhaltszahlungen && !hasKinder) return;

  pdfFields.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;

  attachment.push({ title: ATTACHMENT_DESCRIPTION_SECTION_E, level: "h2" });

  if (zahltPartnerUnterhalt) {
    attachment.push({ title: "Partner", level: "h3" });
    attachment.push({
      title: "Name",
      text: `${context.partnerVorname} ${context.partnerNachname}`,
    });
    attachment.push({
      title: "Monatliche Unterhaltszahlungen",
      text: context.unterhaltsSumme + " €",
    });
    attachment.push({
      title: "Gemeinsame Wohnung",
      text: context.zusammenleben === "yes" ? "Ja" : "Nein",
    });
    if (context.partnerEinkommenSumme)
      attachment.push({
        title: "Eigene monatlichen Einnahmen",
        text: context.partnerEinkommenSumme + " €",
      });
  }

  if (hasKinder) {
    attachment.push({ title: "Kinder", level: "h3" });

    kinder.forEach((kind, index) => {
      attachment.push({ title: `Kind ${index + 1}`, level: "h4" });
      attachment.push({
        title: "Name",
        text: `${kind.vorname} ${kind.nachname}`,
      });
      attachment.push({ title: "Geburtsdatum", text: kind.geburtsdatum });
      attachment.push({
        title: "Monatliche Unterhaltszahlungen",
        text: kind.unterhaltsSumme
          ? kind.unterhaltsSumme + " €"
          : "Keine Angabe",
      });
      attachment.push({
        title: "Gemeinsame Wohnung",
        text: kind.wohnortBeiAntragsteller === "yes" ? "Ja" : "Nein",
      });
      if (kind.einnahmen)
        attachment.push({
          title: "Eigene monatlichen Einnahmen",
          text: kind.einnahmen + " €",
        });
    });
  }

  if (hasUnterhaltszahlungen) {
    attachment.push({
      title: "Andere Personen",
      level: "h3",
    });

    unterhaltszahlungen.forEach((person, index) => {
      attachment.push({ title: `Person ${index + 1}`, level: "h4" });
      attachment.push({
        title: "Name",
        text: `${person.firstName} ${person.surname}`,
      });
      attachment.push({ title: "Geburtsdatum", text: person.birthday });
      attachment.push({
        title: "Familienverhältnis",
        text: familyRelationshipMap[person.familyRelationship],
      });
      attachment.push({
        title: "Monatliche Unterhaltszahlungen",
        text: `${person.monthlyPayment} €`,
      });
    });
  }
}