import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import {
  eigentuemerMapping,
  attachBankkontenToAnhang,
  grundeigentumArtMapping,
  attachGrundeigentumToAnhang,
  fillSingleKraftfahrzeug,
  verkaufswertMappingDescription,
  attachKraftfahrzeugeToAnhang,
} from "~/services/pdf/shared/eigentumHelpers";
import { arrayIsNonEmpty } from "~/util/array";

export const fillBankkonto: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { bankkonten, hasBankkonto } = userData;
  pdfValues.nein_37.value = hasBankkonto === "no";
  pdfValues.ja_36.value = hasBankkonto === "yes";
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
  const { grundeigentum, hasGrundeigentum } = userData;
  pdfValues.nein_39.value = hasGrundeigentum === "no";
  pdfValues.ja_37.value = hasGrundeigentum === "yes";
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

export const fillKraftfahrzeuge: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { kraftfahrzeuge, hasKraftfahrzeug } = userData;
  pdfValues.nein_41.value = hasKraftfahrzeug === "no";
  pdfValues.ja_38.value = hasKraftfahrzeug === "yes";
  if (!arrayIsNonEmpty(kraftfahrzeuge)) return { pdfValues };
  if (kraftfahrzeuge.length == 1) {
    const kraftfahrzeug = kraftfahrzeuge[0];
    pdfValues.markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand.value =
      fillSingleKraftfahrzeug(kraftfahrzeug);
    const singleKfzWert = kraftfahrzeug.wert
      ? verkaufswertMappingDescription[kraftfahrzeug.wert]
      : "";
    pdfValues.verkehrswert2.value = kraftfahrzeug.verkaufswert
      ? `${kraftfahrzeug.verkaufswert} €`
      : singleKfzWert;
    return { pdfValues };
  }
  pdfValues.markeTypBaujahrAnschaffungsjahrAlleinoderMiteigentumKilometerstand.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  const { attachment } = attachKraftfahrzeugeToAnhang([], kraftfahrzeuge);
  return { pdfValues, attachment };
};

export const fillEigentum: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillBankkonto, fillGrundeigentum, fillKraftfahrzeuge],
  });
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "G Eigentum", level: "h2" }, ...attachment]
        : [],
  };
};
