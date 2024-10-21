import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import {
  eigentuemerMapping,
  attachBankkontenToAnhang,
  grundeigentumArtMapping,
  attachGrundeigentumToAnhang,
} from "~/services/pdf/shared/eigentumHelpers";
import { arrayIsNonEmpty } from "~/util/array";

export const fillBankkonto: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  pdfValues.nein_37.value = userData.hasBankkonto === "no";
  pdfValues.ja_36.value = userData.hasBankkonto === "yes";
  const { bankkonten } = userData;
  if (!arrayIsNonEmpty(bankkonten)) return { pdfValues };
  if (bankkonten.length == 1) {
    const { kontoEigentuemer, kontostand, kontoDescription, iban, bankName } =
      bankkonten[0];
    pdfValues.artdesKontosKontoinhaberKreditinstitut.value = `Bank: ${bankName}`;
    pdfValues.artdesKontosKontoinhaberKreditinstitut.value += `, Inhaber: ${eigentuemerMapping[kontoEigentuemer]}`;
    if (kontoDescription)
      pdfValues.artdesKontosKontoinhaberKreditinstitut.value += `, Bezeichnung: ${kontoDescription}`;
    if (iban)
      pdfValues.artdesKontosKontoinhaberKreditinstitut.value += `, IBAN: ${iban}`;

    pdfValues.kontostand.value = kontostand + " €";
    return { pdfValues };
  }
  pdfValues.artdesKontosKontoinhaberKreditinstitut.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  // TODO: replace with fillPdfFieldOrMoveToAttachment
  const { attachment } = attachBankkontenToAnhang([], bankkonten);
  return { pdfValues, attachment };
};

export const fillGrundeigentum: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  pdfValues.nein_39.value = userData.hasGrundeigentum === "no";
  pdfValues.ja_37.value = userData.hasGrundeigentum === "yes";
  const { grundeigentum } = userData;
  if (!arrayIsNonEmpty(grundeigentum)) return { pdfValues };
  if (grundeigentum.length == 1) {
    const {
      isBewohnt,
      art,
      eigentuemer,
      flaeche,
      verkaufswert,
      strassehausnummer,
      plz,
      ort,
      land,
    } = grundeigentum[0];
    pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value = `Art: ${art ? grundeigentumArtMapping[art] : ""}`;
    if (isBewohnt === "yes")
      pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value += `, Eigennutzung`;
    else if (isBewohnt === "family")
      pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value +=
        ", Bewohnt von Familie";
    if (isBewohnt !== "yes")
      pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value += `, Addresse: ${strassehausnummer}, ${plz} ${ort} ${land}`;
    pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value += `, Fläche: ${flaeche} m²`;
    if (eigentuemer === "myselfAndSomeoneElse")
      pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value += `, Eigentümer: ${eigentuemerMapping[eigentuemer]}`;
    pdfValues.verkehrswert.value = `${verkaufswert} €`;
    return { pdfValues };
  }
  pdfValues.groesseAnschriftGrundbuchbezeichnungAlleinoderMiteigentumZahlderWohneinheiten.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;

  const { attachment } = attachGrundeigentumToAnhang([], grundeigentum);
  return { pdfValues, attachment };
};

export const fillEigentum: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillBankkonto, fillGrundeigentum],
  });
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "G Eigentum", level: "h2" }, ...attachment]
        : [],
  };
};
