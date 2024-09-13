import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { finanzielleAngabeEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";
import type { PkhPdfFillFunction } from ".";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt";

export const versicherungMapping = {
  haftpflichtversicherung: "Haftpflichtversicherung",
  hausratsversicherung: "Hausratsversicherung",
  kfzVersicherung: "KFZ-Versicherung",
  pivateKrankenzusatzversicherung: "Pivate Krankenzusatzversicherung",
  unfallversicherung: "Unfallversicherung",
  sonstige: "Sonstige",
} as const;

export type Versicherung = NonNullable<
  ProzesskostenhilfeFormularContext["versicherungen"]
>[number];

export function mapVersicherungsArt(versicherung: Versicherung) {
  return versicherung.art === "sonstige" && versicherung.sonstigeArt
    ? versicherung.sonstigeArt
    : versicherungMapping[versicherung.art];
}

export const fillAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    userData.hasAusgaben !== "yes" ||
    !userData.versicherungen ||
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData })
  )
    return { pdfValues };
  const attachment: AttachmentEntries = [];

  if (guards.isSelfEmployed({ context: userData })) {
    pdfValues.monatlicheAbzuegeinEuro1.value = `${userData.selbststaendigAbzuege}€`;
    pdfValues.steuernSolidaritaetszuschlag1.value = "Abzüge zusammengerechnet";
  }

  if (guards.usesPublicTransit({ context: userData })) {
    pdfValues.steuernSolidaritaetszuschlag_2.value = "ÖPNV";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.monatlicheOPNVKosten}€`;
  } else if (guards.usesPrivateVehicle({ context: userData })) {
    pdfValues.steuernSolidaritaetszuschlag_2.value = "KFZ";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.arbeitsplatzEntfernung}km`;
  }

  const versicherungenNeedsAttachment =
    userData.versicherungen && userData.versicherungen.length > 1;

  if (versicherungenNeedsAttachment) {
    attachment.push({ title: "Abzüge", level: "h2" });
  }

  if (versicherungenNeedsAttachment) {
    pdfValues.sonstigeVersicherungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    attachment.push({ title: "Versicherungen", level: "h3" });
    userData.versicherungen.forEach((versicherung) => {
      attachment.push({
        title: mapVersicherungsArt(versicherung),
        text: `${versicherung.beitrag}€ / Monat`,
      });
    });
  } else {
    pdfValues.sonstigeVersicherungen.value = mapVersicherungsArt(
      userData.versicherungen[0],
    );
    pdfValues.monatlicheAbzuegeinEuro3.value =
      userData.versicherungen[0].beitrag;
  }

  if (guards.hasAndereArbeitsausgaben({ context: userData })) {
    if (userData.arbeitsausgaben!.length > 1) {
      pdfValues.sozialversicherungsbeitraege_2.value = "Siehe Anhang";
      pdfValues.monatlicheAbzuegeinEuro5.value = `${getTotalMonthlyFinancialEntries(userData.arbeitsausgaben!)}€`;
      attachment.push({
        title: "Ausgaben im Zusammenhang mit Ihrer Arbeit",
        level: "h3",
      });
      userData.arbeitsausgaben!.forEach((arbeitsausgabe) => {
        attachment.push({
          title: arbeitsausgabe.beschreibung,
          text: `${arbeitsausgabe.betrag}€/Monat`,
        });
      });
    } else {
      const { beschreibung, betrag } = userData.arbeitsausgaben![0];
      pdfValues.sozialversicherungsbeitraege_2.value = beschreibung;
      pdfValues.monatlicheAbzuegeinEuro5.value = `${betrag}€`;
    }
  }

  return { pdfValues, attachment };
};
