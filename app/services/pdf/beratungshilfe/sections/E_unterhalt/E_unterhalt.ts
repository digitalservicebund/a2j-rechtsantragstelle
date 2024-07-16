import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import {
  getListKidsUnterhaltPdfField,
  getListPersonUnterhaltPdfField,
} from "./unterhaltPdfField";
import type { AttachmentEntries } from "../../../attachment";

export const ATTACHMENT_DESCRIPTION_SECTION_E = "Feld E: Unterhaltszahlungen";
export const SEE_IN_ATTACHMENT_DESCRIPTION = "Siehe Anhang";

export function fillUnterhalt(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const listPersonUnterhaltPdfField = getListPersonUnterhaltPdfField(context);
  const listKinderUnterhaltPdfField = getListKidsUnterhaltPdfField(context);
  if (
    listPersonUnterhaltPdfField.length === 0 &&
    listKinderUnterhaltPdfField.length === 0
  )
    return;

  pdfFields.e1Person1.value = SEE_IN_ATTACHMENT_DESCRIPTION;

  attachment.push({
    title: ATTACHMENT_DESCRIPTION_SECTION_E,
    level: "h2",
  });

  if (listKinderUnterhaltPdfField.length > 0) {
    attachment.push({
      title: "Kinder",
      level: "h3",
    });

    listKinderUnterhaltPdfField.forEach((kind, index) => {
      attachment.push({
        title: `Kind ${index + 1}`,
        level: "h4",
      });
      attachment.push({ title: "Name", text: kind.name });
      attachment.push({ title: "Geburtsdatum", text: kind.geburtsdatum });

      if (kind.hatEinnahmen && kind.einnahmenSumme)
        attachment.push({
          title: "Eigene monatlichen Einnahmen",
          text: kind.einnahmenSumme + " €",
        });
      attachment.push({
        title: "Monatliche Unterhaltszahlungen",
        text: kind.unterhaltSumme ? kind.unterhaltSumme + " €" : "Keine Angabe",
      });
      attachment.push({
        title: "Gemeinsame Wohnung",
        text: kind.lebenZusammen ? "Ja" : "Nein",
      });
    });
  }

  if (listPersonUnterhaltPdfField.length > 0) {
    attachment.push({
      title: "Andere Personen",
      level: "h3",
    });

    listPersonUnterhaltPdfField.forEach((person, index) => {
      attachment.push({
        title: `Person ${index + 1}`,
        level: "h4",
      });
      attachment.push({ title: "Name", text: person.name });
      attachment.push({ title: "Geburtsdatum", text: person.geburtsdatum });
      attachment.push({
        title: "Familienverhältnis",
        text: person.familienverhaeltnis,
      });

      if (person.hatEinnahmen && person.einnahmenSumme)
        attachment.push({
          title: "Eigene monatlichen Einnahmen",
          text: person.einnahmenSumme + " €",
        });
      attachment.push({
        title: "Monatliche Unterhaltszahlungen",
        text: person.unterhaltSumme
          ? person.unterhaltSumme + " €"
          : "Keine Angabe",
      });
      if (person.familienverhaeltnis === "Partner:in") {
        attachment.push({
          title: "Gemeinsame Wohnung",
          text: person.lebenZusammen ? "Ja" : "Nein",
        });
      }
    });
  }
}
