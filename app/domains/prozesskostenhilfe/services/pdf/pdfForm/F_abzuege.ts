import type { AttachmentEntries } from "~/services/pdf/attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import type { PkhPdfFillFunction } from "../types";
import { getTotalMonthlyFinancialEntries } from "../util";
import { zahlungsfrequenzMapping } from "./E_bruttoEinnahmen/bruttoEinnahmen_eigenes";

export const fillAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillSelfAbzuege, fillPartnerAbzuege],
  });
  return {
    pdfValues: filledValues,
    attachment,
  };
};

export const fillSelfAbzuege: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.selbststaendigAbzuege) {
    pdfValues.monatlicheAbzuegeinEuro1.value = `${userData.selbststaendigAbzuege} €`;
    pdfValues.steuernSolidaritaetszuschlag1.value = "Abzüge zusammengerechnet";
  }

  if (userData.arbeitsweg === "publicTransport") {
    pdfValues.steuernSolidaritaetszuschlag_2.value =
      "ÖPNV; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.monatlicheOPNVKosten} €`;
  } else if (userData.arbeitsweg === "privateVehicle") {
    pdfValues.steuernSolidaritaetszuschlag_2.value =
      "KFZ; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.arbeitsplatzEntfernung}km`;
  }

  const attachment: AttachmentEntries = [];
  const arbeitswegNeedsAttachment =
    userData.arbeitsweg === "privateVehicle" ||
    userData.arbeitsweg === "publicTransport";
  const versicherungenNeedsAttachment =
    userData.versicherungen !== undefined && userData.versicherungen.length > 1;
  const arbeitsausgabenNeedsAttachment =
    userData.arbeitsausgaben && userData.arbeitsausgaben.length > 1;

  if (
    versicherungenNeedsAttachment ||
    arbeitsausgabenNeedsAttachment ||
    arbeitswegNeedsAttachment
  ) {
    attachment.push({ title: "F Abzüge", level: "h2" });
  }

  const averageMonthlyExpenses = getTotalMonthlyFinancialEntries(
    userData.arbeitsausgaben ?? [],
  );

  if (userData.arbeitsausgaben?.length === 1) {
    const { beschreibung, betrag } = userData.arbeitsausgaben[0];
    const arbeitsausgabe = userData.arbeitsausgaben[0];
    pdfValues.sozialversicherungsbeitraege_2.value = `${beschreibung} (${betrag} € ${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`;
    pdfValues.monatlicheAbzuegeinEuro5.value = `${averageMonthlyExpenses} €`;
  } else if (arbeitsausgabenNeedsAttachment) {
    pdfValues.sozialversicherungsbeitraege_2.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
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

  if (arbeitswegNeedsAttachment) {
    attachment.push({
      title: "Fahrt zur Arbeit",
      level: "h3",
      text: `Arbeitsadresse: 
      ${userData.arbeitsplatz?.strasseHausnummer}
      ${userData.arbeitsplatz?.plz} ${userData.arbeitsplatz?.ort}
      `,
    });
  }

  return { pdfValues, attachment };
};

const fillPartnerAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    userData.partnerschaft !== "yes" ||
    userData.partnerEinkommen === "no" ||
    userData.staatlicheLeistungen === "grundsicherung" ||
    userData.staatlicheLeistungen === "asylbewerberleistungen" ||
    userData["partner-staatlicheLeistungen"] === "grundsicherung" ||
    userData["partner-staatlicheLeistungen"] === "asylbewerberleistungen"
  ) {
    return { pdfValues };
  }

  if (userData["partner-selbststaendigAbzuege"]) {
    pdfValues.monatlicheAbzuegeinEuro6.value = `${userData["partner-selbststaendigAbzuege"]} €`;
    pdfValues.steuernSolidaritaetszuschlag2.value = "Abzüge zusammengerechnet";
  }

  if (userData["partner-arbeitsweg"] === "publicTransport") {
    pdfValues.fahrtkostenEhegatte.value = "ÖPNV; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEuro9.value = `${userData["partner-monatlicheOPNVKosten"]} €`;
  } else if (userData["partner-arbeitsweg"] === "privateVehicle") {
    pdfValues.fahrtkostenEhegatte.value = "KFZ; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEuro9.value = `${userData["partner-arbeitsplatzEntfernung"]}km`;
  }

  const attachment: AttachmentEntries = [];
  const arbeitsausgabenNeedsAttachment =
    userData["partner-arbeitsausgaben"] &&
    userData["partner-arbeitsausgaben"].length > 1;
  const arbeitswegNeedsAttachment =
    userData["partner-arbeitsweg"] === "privateVehicle" ||
    userData["partner-arbeitsweg"] === "publicTransport";

  if (arbeitsausgabenNeedsAttachment || arbeitswegNeedsAttachment) {
    attachment.push({ title: "F Abzüge - Partner:in", level: "h2" });
  }

  const averageMonthlyExpenses = getTotalMonthlyFinancialEntries(
    userData["partner-arbeitsausgaben"] ?? [],
  );

  if (userData["partner-arbeitsausgaben"]?.length === 1) {
    const { beschreibung, betrag } = userData["partner-arbeitsausgaben"][0];
    const arbeitsausgabe = userData["partner-arbeitsausgaben"][0];
    pdfValues.sonstigewerbungskostenEhegatte.value = `${beschreibung} (${betrag} € ${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`;
    pdfValues.monatlicheAbzuegeinEuro10.value = `${averageMonthlyExpenses} €`;
  } else if (arbeitsausgabenNeedsAttachment) {
    pdfValues.sonstigewerbungskostenEhegatte.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
    pdfValues.monatlicheAbzuegeinEuro10.value = `${averageMonthlyExpenses} €`;
    attachment.push({
      title: "Sonstige Werbungskosten/Betriebsausgaben - Partner:in",
      level: "h3",
      text: `Durchschnittliche Gesamtkosten pro Monat: ${averageMonthlyExpenses} €`,
    });
    userData["partner-arbeitsausgaben"]!.forEach((arbeitsausgabe) => {
      attachment.push({
        title: arbeitsausgabe.beschreibung,
        text: `${arbeitsausgabe.betrag} € (${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`,
      });
    });
  }

  if (arbeitswegNeedsAttachment) {
    attachment.push({
      title: "Fahrt zur Arbeit",
      level: "h3",
      text: `Arbeitsadresse: 
      ${userData["partner-arbeitsplatz"]?.strasseHausnummer}
      ${userData["partner-arbeitsplatz"]?.plz} ${userData["partner-arbeitsplatz"]?.ort}
      `,
    });
  }

  return { pdfValues, attachment };
};
