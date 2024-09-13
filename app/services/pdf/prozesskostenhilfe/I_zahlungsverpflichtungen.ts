import _ from "lodash";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import type { AttachmentEntries } from "../attachment";
import { eigentuemerMapping } from "../beratungshilfe/eigentuemerMapping";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt";

type Zahlung = NonNullable<
  | ProzesskostenhilfeFormularContext["ratenzahlungen"]
  | ProzesskostenhilfeFormularContext["sonstigeAusgaben"]
>[0];

const ZAHLUNGSVERPFLICHTUNG_DESCRIPTION_LINE_LENGTH = 41;

const description = (zahlung: Zahlung) =>
  `${zahlung.art}, ${zahlung.zahlungsempfaenger}` +
  ("laufzeitende" in zahlung ? `, bis ${zahlung.laufzeitende}` : "");

const alleinZahlung = (ratenzahlung: Zahlung) =>
  ratenzahlung.zahlungspflichtiger === "myself"
    ? ratenzahlung.betragGesamt
    : ratenzahlung.betragEigenerAnteil;

export const fillZahlungsverpflichtungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const ratenzahlungen = userData.ratenzahlungen ?? [];
  const sonstigeAusgaben = userData.sonstigeAusgaben ?? [];
  if (
    userData.hasAusgaben !== "yes" ||
    (ratenzahlungen.length == 0 && sonstigeAusgaben.length == 0) ||
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  )
    return { pdfValues };

  const zahlungenWithDescription = (
    [...ratenzahlungen, ...sonstigeAusgaben] as Zahlung[]
  ).map((zahlung) => ({
    ...zahlung,
    description: description(zahlung),
  }));

  const [zahlungLong, zahlungShort] = _.partition(
    zahlungenWithDescription,
    (zahlung) =>
      zahlung.description.length >
      ZAHLUNGSVERPFLICHTUNG_DESCRIPTION_LINE_LENGTH,
  );

  const needAttachement = zahlungShort.length > 3 || zahlungLong.length > 0;

  if (needAttachement) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    const attachment: AttachmentEntries = [
      { title: "Sonstige Zahlungsverpflichtungen", level: "h2" },
    ];

    zahlungenWithDescription.forEach((zahlung) => {
      attachment.push(
        { level: "h3", title: zahlung.art },
        {
          title: "Zahlungspflichtiger",
          text: eigentuemerMapping[zahlung.zahlungspflichtiger],
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
      if ("restschuld" in zahlung) {
        attachment.push({
          title: "Restschuld in EUR",
          text: zahlung.restschuld,
        });
      }
      if ("laufzeitende" in zahlung)
        attachment.push({
          title: "Laufzeitende",
          text: zahlung.laufzeitende,
        });
    });
    return { pdfValues, attachment };
  }

  if (zahlungenWithDescription.length > 0) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value =
      zahlungenWithDescription[0].description;
    if ("restschuld" in zahlungenWithDescription[0])
      pdfValues.restschuldinEUR.value = zahlungenWithDescription[0].restschuld;
    pdfValues.monatlicheGesamtbelastung1.value =
      zahlungenWithDescription[0].betragGesamt;
    pdfValues.ichalleinzahledavon3.value = alleinZahlung(
      zahlungenWithDescription[0],
    );
  }

  if (zahlungenWithDescription.length > 1) {
    pdfValues.sonstigeZahlungsverpflichtungen2.value =
      zahlungenWithDescription[1].description;
    if ("restschuld" in zahlungenWithDescription[1])
      pdfValues.restschuldinEUR_2.value =
        zahlungenWithDescription[1].restschuld;
    pdfValues.monatlicheGesamtbelastung2.value =
      zahlungenWithDescription[1].betragGesamt;
    pdfValues.ichalleinzahledavon4.value = alleinZahlung(
      zahlungenWithDescription[1],
    );
  }

  if (zahlungenWithDescription.length > 2) {
    pdfValues.sonstigeZahlungsverpflichtungen3.value =
      zahlungenWithDescription[2].description;
    if ("restschuld" in zahlungenWithDescription[2])
      pdfValues.restschuldinEUR_3.value =
        zahlungenWithDescription[2].restschuld;
    pdfValues.monatlicheGesamtbelastung3.value =
      zahlungenWithDescription[2].betragGesamt;
    pdfValues.ichalleinzahledavon5.value = alleinZahlung(
      zahlungenWithDescription[2],
    );
  }

  return { pdfValues };
};
