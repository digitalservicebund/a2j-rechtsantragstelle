import type { AttachmentEntries } from "~/services/pdf/attachment";
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
  fillSingleGeldanlage,
  fillSingleWertsache,
  attachGeldanlagenToAnhang,
} from "~/services/pdf/shared/eigentumHelpers";
import { arrayIsNonEmpty } from "~/util/array";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../attachment";

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
  // TODO: replace with fillPdfFieldOrMoveToAttachment
  const { attachment } = attachGrundeigentumToAnhang(grundeigentum);
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
  // TODO: replace with fillPdfFieldOrMoveToAttachment
  const { attachment } = attachKraftfahrzeugeToAnhang(kraftfahrzeuge);
  return { pdfValues, attachment };
};

export const fillBargeldOderWertgegenstaende: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { hasGeldanlage, hasWertsache, geldanlagen, wertsachen } = userData;
  const bargeld = geldanlagen
    ? geldanlagen.filter((geldanlage) => geldanlage.art === "bargeld")
    : [];
  const hasBargeldOderWertgegenstaende =
    hasWertsache === "yes" || hasGeldanlage === "yes";
  if (!hasBargeldOderWertgegenstaende) {
    pdfValues.nein_43.value = true;
    return { pdfValues };
  }

  pdfValues.ja_39.value = hasBargeldOderWertgegenstaende;
  if (bargeld.length + (wertsachen?.length ?? 0) === 1) {
    const singleBargeld = bargeld[0];
    const singleWertsache = wertsachen?.at(0);
    const singleVermoegenswert = singleBargeld ?? singleWertsache;
    const singleVermoegenswertString = singleBargeld
      ? fillSingleGeldanlage(singleBargeld)
      : fillSingleWertsache(singleWertsache!);
    pdfValues.bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum.value =
      singleVermoegenswertString;
    pdfValues.verkehrswert3.value = singleVermoegenswert.wert + " €";
    return { pdfValues };
  }
  pdfValues.bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  const attachment: AttachmentEntries = [];
  attachment.push({
    title: "Bargeld oder Wertgegenstände",
    level: "h3",
  });
  bargeld.forEach((bargeld, index) => {
    const bargeldEigentumer = bargeld.eigentuemer
      ? eigentuemerMapping[bargeld.eigentuemer]
      : "";
    attachment.push(
      {
        title: `Bargeld ${index + 1}`,
        level: "h4",
      },
      {
        title: "Art",
        text: "Bargeld",
      },
      {
        title: "Wert",
        text: `${bargeld.wert} €`,
      },
      {
        title: "Eigentümer:in",
        text: bargeldEigentumer,
      },
    );
  });

  wertsachen?.forEach((wertsache, index) => {
    attachment.push(
      { title: `Wertsache ${index + 1}`, level: "h4" },
      { title: "Art", text: wertsache.art },
      { title: "Wert", text: wertsache.wert },
      {
        title: "Eigentümer:in",
        text: eigentuemerMapping[wertsache.eigentuemer],
      },
    );
  });
  return {
    pdfValues,
    attachment,
  };
};

export const fillSonstigeVermoegenswerte: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { geldanlagen } = userData;
  // Bargeld has already been accounted for in G-4
  const nonBargeldGeldanlagen =
    geldanlagen?.filter((geldAnlage) => geldAnlage.art !== "bargeld") ?? [];
  if (!arrayIsNonEmpty(nonBargeldGeldanlagen)) {
    pdfValues.nein_46.value = true;
    return { pdfValues };
  }
  pdfValues.ja_41.value = true;
  if (nonBargeldGeldanlagen.length === 1) {
    pdfValues.bezeichnungAlleinoderMiteigentum.value = fillSingleGeldanlage(
      nonBargeldGeldanlagen[0],
    );
    pdfValues.verkehrswert4.value = nonBargeldGeldanlagen[0].wert + " €";
    return { pdfValues };
  }
  pdfValues.bezeichnungAlleinoderMiteigentum.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  const { attachment } = attachGeldanlagenToAnhang(nonBargeldGeldanlagen);
  return {
    pdfValues,
    attachment,
  };
};

export const fillEigentum: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [
      fillBankkonto,
      fillGrundeigentum,
      fillKraftfahrzeuge,
      fillBargeldOderWertgegenstaende,
      fillSonstigeVermoegenswerte,
    ],
  });
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "G Eigentum", level: "h2" }, ...attachment]
        : [],
  };
};
