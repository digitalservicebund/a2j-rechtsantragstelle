import _ from "lodash";
import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import { finanzielleAngabeEinkuenfteGuards as einkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt/E_unterhalt";
import { eigentuemerMapping } from "../beratungshilfe/eigentuemerMapping";

type Ratenzahlung = NonNullable<
  ProzesskostenhilfeFormularContext["ratenzahlungen"]
>[0];

const RATENZAHLUNG_DESCRIPTION_LINE_LENGTH = 41;

const ratenzahlungDescription = (ratenzahlung: Ratenzahlung) =>
  `${ratenzahlung.art}, ${ratenzahlung.zahlungsempfaenger}, bis ${ratenzahlung.laufzeitende}`;

const alleinZahlung = (ratenzahlung: Ratenzahlung) =>
  ratenzahlung.zahlungspflichtiger === "myself"
    ? ratenzahlung.betragGesamt
    : ratenzahlung.betragEigenerAnteil;

export const fillZahlungsverpflichtungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { hasAusgaben, ratenzahlungen } = userData;
  if (
    hasAusgaben !== "yes" ||
    !ratenzahlungen ||
    einkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  )
    return { pdfValues };

  const [longEntries, shortEntries] = _.partition(
    ratenzahlungen,
    (ratenzahlung) =>
      ratenzahlungDescription(ratenzahlung).length >
      RATENZAHLUNG_DESCRIPTION_LINE_LENGTH,
  );

  const ratenzahlungenNeedsAttachment =
    longEntries.length > 0 || shortEntries.length > 3;

  if (ratenzahlungenNeedsAttachment) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    const attachment: AttachmentEntries = [
      { title: "Sonstige Zahlungsverpflichtungen", level: "h2" },
      { title: "Ratenzahlungen", level: "h3" },
    ];
    ratenzahlungen.forEach((ratenzahlung) => {
      attachment.push(
        { level: "h3", title: ratenzahlung.art },
        {
          title: "Zahlungspflichtiger",
          text: eigentuemerMapping[ratenzahlung.zahlungspflichtiger],
        },
        { title: "Zahlungsempfänger", text: ratenzahlung.zahlungsempfaenger },
        { title: "Restschuld in EUR", text: ratenzahlung.restschuld },
        { title: "Laufzeitende", text: ratenzahlung.laufzeitende },
        { title: "Gesamtbelastung monatlich", text: ratenzahlung.betragGesamt },
      );
      if (ratenzahlung.zahlungspflichtiger !== "myself") {
        attachment.push({
          title: "Eigenbelastung monatlich",
          text: ratenzahlung.betragEigenerAnteil,
        });
      }
    });
    return { pdfValues, attachment };
  }

  if (shortEntries.length > 0) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value = ratenzahlungDescription(
      shortEntries[0],
    );
    pdfValues.restschuldinEUR.value = shortEntries[0].restschuld;
    pdfValues.monatlicheGesamtbelastung1.value = shortEntries[0].betragGesamt;
    pdfValues.ichalleinzahledavon3.value = alleinZahlung(shortEntries[0]);
  }

  if (shortEntries.length > 1) {
    pdfValues.sonstigeZahlungsverpflichtungen2.value = ratenzahlungDescription(
      shortEntries[1],
    );
    pdfValues.restschuldinEUR_2.value = shortEntries[1].restschuld;
    pdfValues.monatlicheGesamtbelastung2.value = shortEntries[1].betragGesamt;
    pdfValues.ichalleinzahledavon4.value = alleinZahlung(shortEntries[1]);
  }

  if (shortEntries.length > 2) {
    pdfValues.sonstigeZahlungsverpflichtungen3.value = ratenzahlungDescription(
      shortEntries[2],
    );
    pdfValues.restschuldinEUR_3.value = shortEntries[2].restschuld;
    pdfValues.monatlicheGesamtbelastung3.value = shortEntries[2].betragGesamt;
    pdfValues.ichalleinzahledavon5.value = alleinZahlung(shortEntries[2]);
  }

  return { pdfValues };
};
