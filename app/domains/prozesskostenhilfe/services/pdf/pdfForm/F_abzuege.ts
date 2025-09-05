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
    pdfValues.monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlag.value = `${userData.selbststaendigAbzuege} €`;
    pdfValues.steuernSolidarzuschlag.value = "Abzüge zusammengerechnet";
  }

  if (userData.arbeitsweg === "publicTransport") {
    pdfValues.fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung.value =
      "ÖPNV; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEurodurchFahrtkosten.value = `${userData.monatlicheOPNVKosten} €`;
  } else if (userData.arbeitsweg === "privateVehicle") {
    pdfValues.fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzung.value =
      "KFZ; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEurodurchFahrtkosten.value = `${userData.arbeitsplatzEntfernung}km`;
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
    pdfValues.sozialversicherungsbeitraege.value = `${beschreibung} (${betrag} € ${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`;
    pdfValues.monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege.value = `${averageMonthlyExpenses} €`;
  } else if (arbeitsausgabenNeedsAttachment) {
    pdfValues.sozialversicherungsbeitraege.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
    pdfValues.monatlicheAbzuegeinEurodurchSozialversicherungsbeitraege.value = `${averageMonthlyExpenses} €`;
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
      ${userData.arbeitsplatz?.plz} ${userData.arbeitsplatz?.ort} ${userData.arbeitsplatz?.land}
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
    pdfValues.monatlicheAbzuegeinEurodurchSteuernSolidaritaetszuschlagPartnerPartnerin.value = `${userData["partner-selbststaendigAbzuege"]} €`;
    pdfValues.steuernSolidarzuschlagPartnerPartnerin.value =
      "Abzüge zusammengerechnet";
  }

  if (userData["partner-arbeitsweg"] === "publicTransport") {
    pdfValues.fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzungPa.value =
      "ÖPNV; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEurodurchFahrtkostenPartnerPartnerin.value = `${userData["partner-monatlicheOPNVKosten"]} €`;
  } else if (userData["partner-arbeitsweg"] === "privateVehicle") {
    pdfValues.fahrtzurArbeitKostenfueroeffentlicheVerkehrsmittelodereinfacheEntfernungbeiKFZNutzungPa.value =
      "KFZ; Arbeitsadresse: siehe Anhang";
    pdfValues.monatlicheAbzuegeinEurodurchFahrtkostenPartnerPartnerin.value = `${userData["partner-arbeitsplatzEntfernung"]}km`;
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
    pdfValues.sonstigeWerbungskostenBetriebsausgabenPartnerPartnerin.value = `${beschreibung} (${betrag} € ${zahlungsfrequenzMapping[arbeitsausgabe.zahlungsfrequenz]})`;
    pdfValues.monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgabenPartnerPartnerin.value = `${averageMonthlyExpenses} €`;
  } else if (arbeitsausgabenNeedsAttachment) {
    pdfValues.sonstigeWerbungskostenBetriebsausgabenPartnerPartnerin.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
    pdfValues.monatlicheAbzuegeinEurodurchSonstigeWerbungskostenBetriebsausgabenPartnerPartnerin.value = `${averageMonthlyExpenses} €`;
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
      ${userData["partner-arbeitsplatz"]?.plz} ${userData["partner-arbeitsplatz"]?.ort} ${userData["partner-arbeitsplatz"]?.land}
      `,
    });
  }

  return { pdfValues, attachment };
};
