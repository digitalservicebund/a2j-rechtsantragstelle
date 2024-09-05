import type { ProzesskostenhilfeFormularContext } from "~/flows/prozesskostenhilfeFormular";
import type { PkhPdfFillFunction } from "./fillOutFunction";
import type { AttachmentEntries } from "../attachment";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../beratungshilfe/sections/E_unterhalt/E_unterhalt";

type Ratenzahlung = NonNullable<
  ProzesskostenhilfeFormularContext["ratenzahlungen"]
>[0];

const artToString = (ratenzahlung: Ratenzahlung) =>
  `${ratenzahlung.art}, ${ratenzahlung.zahlungsempfaenger}, bis ${ratenzahlung.laufzeitende}`;

const alleinZahlung = (ratenzahlung: Ratenzahlung) =>
  ratenzahlung.zahlungspflichtiger === "myself"
    ? ratenzahlung.betragGesamt
    : ratenzahlung.betragEigenerAnteil;

export const fillZahlungsverpflichtungen: PkhPdfFillFunction = ({
  userData: { hasAusgaben, ratenzahlungen },
  pdfValues,
}) => {
  if (hasAusgaben !== "yes" || !ratenzahlungen) return { pdfValues };
  const attachment: AttachmentEntries = [];

  const ratenzahlungenNeedsAttachment =
    ratenzahlungen && ratenzahlungen.length > 3;

  if (ratenzahlungenNeedsAttachment) {
    attachment.push({ title: "Sonstige Zahlungsverpflichtungen", level: "h2" });
  }

  if (ratenzahlungenNeedsAttachment) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;
    attachment.push({ title: "Ratenzahlungen", level: "h3" });
    //TODO: add attachment logic
  }

  if (ratenzahlungen.length > 0) {
    pdfValues.sonstigeZahlungsverpflichtungen1.value = artToString(
      ratenzahlungen[0],
    );
    pdfValues.restschuldinEUR.value = ratenzahlungen[0].restschuld;
    pdfValues.monatlicheGesamtbelastung1.value = ratenzahlungen[0].betragGesamt;
    pdfValues.ichalleinzahledavon3.value = alleinZahlung(ratenzahlungen[0]);
  }

  if (ratenzahlungen.length > 1) {
    pdfValues.sonstigeZahlungsverpflichtungen2.value = artToString(
      ratenzahlungen[1],
    );
    pdfValues.restschuldinEUR_2.value = ratenzahlungen[1].restschuld;
    pdfValues.monatlicheGesamtbelastung2.value = ratenzahlungen[1].betragGesamt;
    pdfValues.ichalleinzahledavon4.value = alleinZahlung(ratenzahlungen[1]);
  }

  if (ratenzahlungen.length > 2) {
    pdfValues.sonstigeZahlungsverpflichtungen3.value = artToString(
      ratenzahlungen[2],
    );
    pdfValues.restschuldinEUR_3.value = ratenzahlungen[2].restschuld;
    pdfValues.monatlicheGesamtbelastung3.value = ratenzahlungen[2].betragGesamt;
    pdfValues.ichalleinzahledavon5.value = alleinZahlung(ratenzahlungen[2]);
  }

  return { pdfValues, attachment };
};
