import type { PkhPdfFillFunction } from "~/domains/prozesskostenhilfe/services/pdf";
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
} from "~/domains/shared/services/pdf/eigentumHelpers";
import {
  SEE_IN_ATTACHMENT_DESCRIPTION,
  type AttachmentEntries,
} from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
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
  const { geldanlagen = [], wertsachen = [] } = userData;
  const bargeld = geldanlagen.filter(
    (geldanlage) => geldanlage.art === "bargeld",
  );
  const hasBargeldOderWertgegenstaende =
    bargeld.length > 0 || wertsachen.length > 0;

  if (!hasBargeldOderWertgegenstaende) {
    pdfValues.nein_43.value = true;
    return { pdfValues };
  }

  pdfValues.ja_39.value = hasBargeldOderWertgegenstaende;
  if (bargeld.length + wertsachen.length === 1) {
    const singleBargeld = bargeld.at(0);
    const singleWertsache = wertsachen.at(0);
    const singleVermoegenswert = singleBargeld ?? singleWertsache;
    const singleVermoegenswertString = singleBargeld
      ? fillSingleGeldanlage(singleBargeld)
      : fillSingleWertsache(singleWertsache!);
    pdfValues.bargeldbetraginEURBezeichnungderWertgegenstaendeAlleinoderMiteigentum.value =
      singleVermoegenswertString;
    pdfValues.verkehrswert3.value = singleVermoegenswert!.wert + " €";
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
    const eigentuemer = bargeld.eigentuemer
      ? eigentuemerMapping[bargeld.eigentuemer]
      : "";
    attachment.push(
      {
        title: `Bargeld ${index + 1}`,
        level: "h4",
      },
      {
        title: "Art",
        text: bargeld.art,
      },
      {
        title: "Wert",
        text: `${bargeld.wert} €`,
      },
      {
        title: "Eigentümer:in",
        text: eigentuemer,
      },
    );
  });

  wertsachen.forEach((wertsache, index) => {
    attachment.push(
      {
        title: `Wertsache ${index + 1}`,
        level: "h4",
      },
      {
        title: "Art",
        text: wertsache.art,
      },
      {
        title: "Wert",
        text: `${wertsache.wert} €`,
      },
      {
        title: "Eigentümer:in",
        text: eigentuemerMapping[wertsache.eigentuemer],
      },
    );
  });
  return {
    pdfValues,
    attachment,
  };
};

export const fillLebensversicherung: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { geldanlagen = [] } = userData;
  const lebensversicherungen = geldanlagen.filter(
    (geldanlage) =>
      geldanlage.art === "befristet" &&
      geldanlage.befristetArt === "lifeInsurance",
  );
  if (lebensversicherungen.length === 1) {
    pdfValues.ja_40.value = true;
    pdfValues.versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvorsorgegemEinkommensteuergesetzdiestaatlichgefoerdertwurdeRiesterRente.value =
      fillSingleGeldanlage(lebensversicherungen[0]);
    pdfValues.rueckkaufswert.value = lebensversicherungen[0].wert + " €";
  } else if (lebensversicherungen.length > 1) {
    pdfValues.ja_40.value = true;
    pdfValues.versicherungVersicherungsnehmerDatumdesVertragesHandeltessichumeinezusaetzlicheAltersvorsorgegemEinkommensteuergesetzdiestaatlichgefoerdertwurdeRiesterRente.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    const { attachment } = attachGeldanlagenToAnhang(
      lebensversicherungen,
      "Lebens- oder Rentenversicherungen",
    );
    return { pdfValues, attachment };
  } else {
    pdfValues.nein_44.value = true;
  }
  return { pdfValues };
};

export const fillSonstigeVermoegenswerte: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { geldanlagen = [] } = userData;
  // Need to exclude Bargeld (accounted for in G-4) and Lebensversicherung (accounted for in G-5)
  const sonstigeVermoegenswerte = geldanlagen.filter(
    (geldAnlage) =>
      geldAnlage.art !== "bargeld" &&
      geldAnlage.befristetArt !== "lifeInsurance",
  );
  if (!arrayIsNonEmpty(sonstigeVermoegenswerte)) {
    pdfValues.nein_46.value = true;
    return { pdfValues };
  }
  pdfValues.ja_41.value = true;
  if (sonstigeVermoegenswerte.length === 1) {
    pdfValues.bezeichnungAlleinoderMiteigentum.value = fillSingleGeldanlage(
      sonstigeVermoegenswerte[0],
    );
    pdfValues.verkehrswert4.value = sonstigeVermoegenswerte[0].wert + " €";
    return { pdfValues };
  }
  pdfValues.bezeichnungAlleinoderMiteigentum.value =
    SEE_IN_ATTACHMENT_DESCRIPTION;
  const { attachment } = attachGeldanlagenToAnhang(sonstigeVermoegenswerte);
  return {
    pdfValues,
    attachment,
  };
};

export const fillEigentum: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    userData.staatlicheLeistungen === "grundsicherung" ||
    userData.staatlicheLeistungen === "asylbewerberleistungen"
  ) {
    return { pdfValues };
  }

  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [
      fillBankkonto,
      fillGrundeigentum,
      fillKraftfahrzeuge,
      fillBargeldOderWertgegenstaende,
      fillLebensversicherung,
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
