import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  type AttachmentEntries,
} from "~/services/pdf/attachment";
import { type StringField } from "~/services/pdf/fileTypes";
import type { PdfFillFunctionProps } from "~/services/pdf/fillOutFunction";

export const familyRelationshipMap = {
  mother: "Mutter",
  father: "Vater",
  grandmother: "Großmutter",
  grandfather: "Großvater",
  kid: "Kind",
  "ex-spouse": "Ex-Ehepart.",
  "ex-partner": "Ex-Partner",
  grandchild: "Enkelkind",
} as const;

export const addSupportRecipientsToAttachment =
  <
    Context extends
      | ProzesskostenhilfeFormularUserData
      | BeratungshilfeFormularUserData,
    PDF extends ProzesskostenhilfePDF | BeratungshilfePDF,
  >({
    userData,
    pdfValues,
  }: PdfFillFunctionProps<Context, PDF>) =>
  (seeAttachmentDescription: string, firstRelationField: keyof PDF) => {
    const attachment: AttachmentEntries = [];
    (pdfValues[firstRelationField] as StringField).value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    attachment.push({ title: seeAttachmentDescription, level: "h2" });
    if (userData.partnerUnterhaltsSumme !== undefined) {
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
      if ((userData as BeratungshilfeFormularUserData).partnerEinkommenSumme)
        attachment.push({
          title: "Eigene monatlichen Einnahmen",
          text:
            (userData as BeratungshilfeFormularUserData).partnerEinkommenSumme +
            " €",
        });
    }

    if (userData.kinder && userData.kinder.length > 0) {
      attachment.push({ title: "Kinder", level: "h3" });

      userData.kinder.forEach((kind, index) => {
        attachment.push({ title: `Kind ${index + 1}`, level: "h4" });
        attachment.push({
          title: "Name",
          text: `${kind.vorname} ${kind.nachname}`,
        });
        attachment.push({ title: "Geburtsdatum", text: kind.geburtsdatum });
        attachment.push({
          title: "Monatliche Unterhaltszahlungen",
          text:
            "unterhaltsSumme" in kind
              ? kind.unterhaltsSumme + " €"
              : "Keine Angabe",
        });
        attachment.push({
          title: "Gemeinsame Wohnung",
          text: kind.wohnortBeiAntragsteller === "yes" ? "Ja" : "Nein",
        });
        if ("einnahmen" in kind)
          attachment.push({
            title: "Eigene monatlichen Einnahmen",
            text: kind.einnahmen + " €",
          });
      });
    }

    if (
      userData.unterhaltszahlungen &&
      userData.unterhaltszahlungen.length > 0
    ) {
      attachment.push({
        title: "Andere Personen",
        level: "h3",
      });

      userData.unterhaltszahlungen.forEach((person, index) => {
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
