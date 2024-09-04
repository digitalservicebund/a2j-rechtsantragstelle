import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import {
  hasAndereArbeitsausgaben,
  isSelfEmployed,
  usesPrivateVehicle,
  usesPublicTransit,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt/E_unterhalt";

const versicherungMapping = {
  haftpflichtversicherung: "Haftpflichtversicherung",
  hausratsversicherung: "Hausratsversicherung",
  kfzVersicherung: "KFZ-Versicherung",
  pivateKrankenzusatzversicherung: "Pivate Krankenzusatzversicherung",
  unfallversicherung: "Unfallversicherung",
  sonstige: "Sonstige",
} as const;

type Versicherung = NonNullable<
  ProzesskostenhilfeFormularContext["versicherungen"]
>[number];

function mapVersicherungsArt(versicherung: Versicherung) {
  return versicherung.art === "sonstige" && versicherung.sonstigeArt
    ? versicherung.sonstigeArt
    : versicherungMapping[versicherung.art];
}

export type Arbeitsausgabe = NonNullable<
  ProzesskostenhilfeFormularContext["arbeitsausgaben"]
>[number];

export const mapArbeitsausgabe = (
  arbeitsausgabe: Arbeitsausgabe,
): [string, number] => {
  let amount: number;
  switch (arbeitsausgabe.zahlungsfrequenz) {
    case "yearly":
    case "one-time":
      amount = Math.ceil(parseInt(arbeitsausgabe.betrag) / 12);
      break;
    case "quarterly":
      amount = Math.ceil(parseInt(arbeitsausgabe.betrag) / 3);
      break;
    default:
      amount = parseInt(arbeitsausgabe.betrag);
  }

  return [arbeitsausgabe.beschreibung, amount];
};

export const getTotalMonthlyArbeitsausgaben = (
  arbeitsausgaben: Arbeitsausgabe[],
) => {
  const [, totalMonthly] = arbeitsausgaben!
    .map(mapArbeitsausgabe)
    .reduce((previous, current) => {
      const [, prevAmount] = previous;
      const [, currAmount] = current;
      const total = prevAmount + currAmount;
      return ["", total];
    });
  return totalMonthly;
};

export const fillAbzuege: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.hasAusgaben !== "yes" || !userData.versicherungen)
    return { pdfValues };
  const attachment: AttachmentEntries = [];

  if (isSelfEmployed({ context: userData })) {
    pdfValues.monatlicheAbzuegeinEuro1.value = `${userData.selbststaendigAbzuege}€`;
    pdfValues.steuernSolidaritaetszuschlag1.value = "Abzüge zusammengerechnet";
  }

  if (usesPublicTransit({ context: userData })) {
    pdfValues.steuernSolidaritaetszuschlag_2.value = "ÖPNV";
    pdfValues.monatlicheAbzuegeinEuro4.value = `${userData.monatlicheOPNVKosten}€`;
  } else if (usesPrivateVehicle({ context: userData })) {
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

  if (hasAndereArbeitsausgaben({ context: userData })) {
    if (userData.arbeitsausgaben!.length > 1) {
      pdfValues.sozialversicherungsbeitraege_2.value = "Siehe Anhang";
      pdfValues.monatlicheAbzuegeinEuro5.value = `${getTotalMonthlyArbeitsausgaben(userData.arbeitsausgaben!)}€`;
      attachment.push({
        title: "Ausgaben im Zusammenhang mit Ihrer Arbeit",
        level: "h3",
      });
      userData
        .arbeitsausgaben!.map(mapArbeitsausgabe)
        .forEach(([description, amount]) => {
          attachment.push({ title: description, text: `${amount}€/Monat` });
        });
    } else {
      const [description, monthlyAmount] = mapArbeitsausgabe(
        userData.arbeitsausgaben![0],
      );
      pdfValues.sozialversicherungsbeitraege_2.value = description;
      pdfValues.monatlicheAbzuegeinEuro5.value = `${monthlyAmount}€`;
    }
  }

  return { pdfValues, attachment };
};
