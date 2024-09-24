import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";
import type { PkhPdfFillFunction } from ".";
import { zahlungsfrequenzMapping } from "./E_bruttoEinnahmen";
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
  if (userData.selbststaendigAbzuege) {
    pdfValues.monatlicheAbzuegeinEuro1.value = `${userData.selbststaendigAbzuege} €`;
    pdfValues.steuernSolidaritaetszuschlag1.value = "Abzüge zusammengerechnet";
  }

  if (userData.arbeitsweg === "publicTransport") {
    pdfValues.steuernSolidaritaetszuschlag_2.value = "ÖPNV";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.monatlicheOPNVKosten} €`;
  } else if (userData.arbeitsweg === "privateVehicle") {
    pdfValues.steuernSolidaritaetszuschlag_2.value = "KFZ";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.arbeitsplatzEntfernung}km`;
  }

  const attachment: AttachmentEntries = [];
  const versicherungenNeedsAttachment =
    userData.versicherungen !== undefined && userData.versicherungen.length > 1;
  const arbeitsausgabenNeedsAttachment =
    userData.arbeitsausgaben && userData.arbeitsausgaben.length > 1;

  if (versicherungenNeedsAttachment || arbeitsausgabenNeedsAttachment) {
    attachment.push({ title: "F Abzüge", level: "h2" });
  }

  if (userData.versicherungen?.length === 1) {
    pdfValues.sonstigeVersicherungen.value = mapVersicherungsArt(
      userData.versicherungen[0],
    );
    pdfValues.monatlicheAbzuegeinEuro3.value =
      userData.versicherungen[0].beitrag + " €";
  } else if (versicherungenNeedsAttachment) {
    pdfValues.sonstigeVersicherungen.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    attachment.push({ title: "Versicherungen", level: "h3" });
    userData.versicherungen!.forEach((versicherung, index) => {
      attachment.push(
        { title: `Versicherung ${index + 1}`, level: "h4" },
        { title: "Art", text: mapVersicherungsArt(versicherung) },
        { title: "Beitrag", text: `${versicherung.beitrag} € / Monat` },
      );
    });
  }

  if (userData.arbeitsausgaben?.length === 1) {
    const { beschreibung, betrag } = userData.arbeitsausgaben[0];
    pdfValues.sozialversicherungsbeitraege_2.value = beschreibung;
    pdfValues.monatlicheAbzuegeinEuro5.value = `${betrag} €`;
  } else if (arbeitsausgabenNeedsAttachment) {
    pdfValues.sozialversicherungsbeitraege_2.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    const averageMonthlyExpenses = getTotalMonthlyFinancialEntries(
      userData.arbeitsausgaben!,
    );
    pdfValues.monatlicheAbzuegeinEuro5.value = `${averageMonthlyExpenses} €`;
    attachment.push({
      title: "Sonstige Werbungskosten/Betriebsausgaben",
      level: "h3",
      text: `Durchschnittliche Gesamtkosten pro Monat: ${averageMonthlyExpenses} €`,
    });
    userData.arbeitsausgaben!.forEach((arbeitsausgabe) => {
      attachment.push({
        title: arbeitsausgabe.beschreibung,
        text: `${arbeitsausgabe.betrag} € (${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`,
      });
    });
  }

  return { pdfValues, attachment };
};
