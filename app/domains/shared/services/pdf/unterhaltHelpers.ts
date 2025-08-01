import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { empfaengerIsChild } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/guards";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { getTotalMonthlyFinancialEntries } from "~/domains/prozesskostenhilfe/services/pdf/util";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import type { PdfFillFunction } from "~/services/pdf/fillOutFunction";

export const familyRelationshipMap = {
  mother: "Meine Mutter",
  father: "Mein Vater",
  grandmother: "Meine Großmutter",
  grandfather: "Mein Großvater",
  kid: "Mein Kind",
  "ex-spouse-f": "Meine Ex-Ehepartnerin",
  "ex-spouse-m": "Mein Ex-Ehepartner",
  grandchild: "Mein Enkelkind",
} as const;

export function getFillUnterhalt<
  Context extends
    | BeratungshilfeFormularUserData
    | ProzesskostenhilfeFormularUserData,
  Pdf extends BeratungshilfePDF | ProzesskostenhilfePDF,
>(
  attachmentTitle: string,
  setAttachmentField: (pdf: Pdf) => void,
): PdfFillFunction<Context, Pdf> {
  return ({ userData, pdfValues }) => {
    const attachment: AttachmentEntries = [];
    const zahltPartnerUnterhalt = userData.partnerUnterhaltsSumme !== undefined;
    const kinder = userData.kinder ?? [];
    const pkhUserData = userData as ProzesskostenhilfeFormularUserData;
    // Need to add the child added as a part of Vereinfachte Erklärung to the kinder array
    if (
      empfaengerIsChild({ context: pkhUserData }) &&
      pkhUserData.child !== undefined
    ) {
      kinder.unshift({
        ...pkhUserData.child,
        wohnortBeiAntragsteller: pkhUserData.livesTogether ? "yes" : "no",
        einnahmen: pkhUserData.einnahmen
          ? getTotalMonthlyFinancialEntries(pkhUserData.einnahmen)
          : undefined,
      });
    }
    const hasKinder = kinder.length > 0;

    const unterhaltszahlungen = userData.unterhaltszahlungen ?? [];
    const hasUnterhaltszahlungen = unterhaltszahlungen.length > 0;

    if (!zahltPartnerUnterhalt && !hasUnterhaltszahlungen && !hasKinder)
      return { pdfValues };

    setAttachmentField(pdfValues);

    attachment.push({ title: attachmentTitle, level: "h2" });

    if (zahltPartnerUnterhalt) {
      attachment.push({ title: "Partner", level: "h3" });
      attachment.push({
        title: "Name",
        text: `${userData.partnerVorname} ${userData.partnerNachname}`,
      });
      attachment.push({
        title: "Monatliche Unterhaltszahlungen",
        text: userData.partnerUnterhaltsSumme + " €",
      });
      attachment.push({
        title: "Gemeinsame Wohnung",
        text: userData.zusammenleben === "yes" ? "Ja" : "Nein",
      });
      if (userData.partnerEinkommenSumme)
        attachment.push({
          title: "Eigene monatlichen Einnahmen",
          text: userData.partnerEinkommenSumme + " €",
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
    return { pdfValues, attachment };
  };
}
