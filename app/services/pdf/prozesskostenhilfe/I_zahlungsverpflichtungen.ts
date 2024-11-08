import partition from "lodash/partition";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import type { PkhPdfFillFunction } from ".";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../attachment";
import { eigentuemerMapping } from "../shared/eigentumHelpers";

type Ratenzahlung = NonNullable<
  ProzesskostenhilfeFormularContext["ratenzahlungen"]
>[number];

type SonstigeAusgabe = NonNullable<
  ProzesskostenhilfeFormularContext["sonstigeAusgaben"]
>[number];

type Versicherung = NonNullable<
  ProzesskostenhilfeFormularContext["versicherungen"]
>[number];

type ZahlungWithDescription = {
  description: string;
  restschuld?: string;
  gesamtbelastung?: string;
  betragEigenerAnteil?: string;
};

const versicherungMapping = {
  haftpflichtversicherung: "Haftpflichtversicherung",
  hausratsversicherung: "Hausratsversicherung",
  kfzVersicherung: "KFZ-Versicherung",
  pivateKrankenzusatzversicherung: "Pivate Krankenzusatzversicherung",
  unfallversicherung: "Unfallversicherung",
  sonstige: "Sonstige",
} as const;

const ZAHLUNGSVERPFLICHTUNG_DESCRIPTION_LINE_LENGTH = 41;

const alleinZahlung = (ratenzahlung: Ratenzahlung) =>
  ratenzahlung.zahlungspflichtiger === "myself"
    ? ratenzahlung.betragGesamt
    : ratenzahlung.betragEigenerAnteil;

const mapVersicherungsArt = (versicherung: Versicherung) =>
  versicherung.art === "sonstige" && versicherung.sonstigeArt
    ? versicherung.sonstigeArt
    : versicherungMapping[versicherung.art];

const mapRatenzahlungAndSonstigeAusgabeToZahlungsverpflichtung = (
  ratenzahlungOrSonstigeAusgabe: Ratenzahlung | SonstigeAusgabe,
) => ({
  description:
    `${ratenzahlungOrSonstigeAusgabe.art}, ${ratenzahlungOrSonstigeAusgabe.zahlungsempfaenger}` +
    ("laufzeitende" in ratenzahlungOrSonstigeAusgabe
      ? `, bis ${ratenzahlungOrSonstigeAusgabe.laufzeitende}`
      : ""),
  restschuld:
    "restschuld" in ratenzahlungOrSonstigeAusgabe
      ? ratenzahlungOrSonstigeAusgabe.restschuld
      : undefined,
  gesamtbelastung: ratenzahlungOrSonstigeAusgabe.betragGesamt,
  betragEigenerAnteil: ratenzahlungOrSonstigeAusgabe.betragEigenerAnteil,
});

const mapVersicherungToZahlungsverpflichtung = (
  versicherung: Versicherung,
) => ({
  description: mapVersicherungsArt(versicherung),
  gesamtbelastung: versicherung.beitrag,
});

const pushVersicherungenToAttachment = (
  attachment: AttachmentEntries,
  versicherungen: Versicherung[],
) => {
  attachment.push({ title: "Versicherungen", level: "h3" });
  versicherungen.forEach((versicherung, index) => {
    attachment.push(
      { title: `Versicherung ${index + 1}`, level: "h4" },
      { title: "Art", text: mapVersicherungsArt(versicherung) },
      { title: "Beitrag", text: `${versicherung.beitrag} € / Monat` },
    );
  });
};

const pushRatenzahlungenAndSonstigeAusgabenToAttachment = (
  attachment: AttachmentEntries,
  ratenzahlungenAndSonstigeAusgaben: Ratenzahlung[] | SonstigeAusgabe[],
) => {
  attachment.push({
    title: "Sonstige Zahlungsverpflichtungen",
    level: "h2",
  });
  ratenzahlungenAndSonstigeAusgaben.forEach((zahlung) => {
    attachment.push(
      { level: "h3", title: zahlung.art ?? "" },
      {
        title: "Zahlungspflichtiger",
        text: zahlung.zahlungspflichtiger
          ? eigentuemerMapping[zahlung.zahlungspflichtiger]
          : "",
      },
      { title: "Zahlungsempfänger", text: zahlung.zahlungsempfaenger },
      {
        title: "Gesamtbelastung monatlich",
        text: zahlung.betragGesamt,
      },
    );
    if (zahlung.zahlungspflichtiger !== "myself") {
      attachment.push({
        title: "Eigenbelastung monatlich",
        text: zahlung.betragEigenerAnteil,
      });
    }
    if ("restschuld" in zahlung && typeof zahlung.restschuld === "string") {
      attachment.push({
        title: "Restschuld in EUR",
        text: zahlung.restschuld,
      });
    }
    if ("laufzeitende" in zahlung && typeof zahlung.laufzeitende === "string")
      attachment.push({
        title: "Laufzeitende",
        text: zahlung.laufzeitende,
      });
  });
};

const fillPdfValues = (
  pdfValues: ProzesskostenhilfePDF,
  zahlungShort: ZahlungWithDescription[],
  zahlungenWithDescription: ZahlungWithDescription[],
) => {
  // There are 3 rows to fill in the PDF
  // Inside the loop, keys of the fields are generated with the index
  for (let i = 0; i < 3 && i < zahlungShort.length; i++) {
    const entry = zahlungenWithDescription[i];
    const index = i + 1;
    const sonstigeZahlungsverpflichtungen =
      `sonstigeZahlungsverpflichtungen${index}` as keyof ProzesskostenhilfePDF;
    const restschuldinEUR =
      index > 1
        ? (`restschuldinEUR_${index}` as keyof ProzesskostenhilfePDF)
        : ("restschuldinEUR" as keyof ProzesskostenhilfePDF);
    const monatlicheGesamtbelastung =
      `monatlicheGesamtbelastung${index}` as keyof ProzesskostenhilfePDF;
    const ichalleinzahledavon =
      `ichalleinzahledavon${index + 2}` as keyof ProzesskostenhilfePDF;

    pdfValues[sonstigeZahlungsverpflichtungen].value = entry.description;
    pdfValues[restschuldinEUR].value =
      "restschuld" in entry ? entry.restschuld : undefined;
    pdfValues[monatlicheGesamtbelastung].value =
      "gesamtbelastung" in entry ? entry.gesamtbelastung : "";
    pdfValues[ichalleinzahledavon].value = alleinZahlung(entry);
  }
};

export const fillZahlungsverpflichtungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const ratenzahlungen = userData.ratenzahlungen ?? [];
  const sonstigeAusgaben = userData.sonstigeAusgaben ?? [];
  const versicherungen = userData.versicherungen ?? [];
  const ratenzahlungenAndSonstigeAusgaben = [
    ...ratenzahlungen,
    ...sonstigeAusgaben,
  ];
  if (
    (userData.hasAusgaben !== "yes" && versicherungen.length == 0) ||
    (ratenzahlungen.length == 0 &&
      sonstigeAusgaben.length == 0 &&
      versicherungen.length == 0) ||
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    return { pdfValues };
  }

  const zahlungenWithDescription: ZahlungWithDescription[] = [
    ...ratenzahlungenAndSonstigeAusgaben.map(
      mapRatenzahlungAndSonstigeAusgabeToZahlungsverpflichtung,
    ),
    ...versicherungen.map(mapVersicherungToZahlungsverpflichtung),
  ];

  const [zahlungLong, zahlungShort] = partition(
    zahlungenWithDescription,
    (zahlung) =>
      zahlung.description.length >
      ZAHLUNGSVERPFLICHTUNG_DESCRIPTION_LINE_LENGTH,
  );

  const needAttachement = zahlungShort.length > 3 || zahlungLong.length > 0;

  if (needAttachement) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    const attachment: AttachmentEntries = [];

    if (ratenzahlungenAndSonstigeAusgaben) {
      pushRatenzahlungenAndSonstigeAusgabenToAttachment(
        attachment,
        ratenzahlungenAndSonstigeAusgaben,
      );
    }

    if (versicherungen) {
      pushVersicherungenToAttachment(attachment, versicherungen);
    }
    return { pdfValues, attachment };
  }

  fillPdfValues(pdfValues, zahlungShort, zahlungenWithDescription);

  return { pdfValues };
};
