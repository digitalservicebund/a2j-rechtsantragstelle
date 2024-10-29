import { finanzielleAngabeEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/services/pdf/attachment";
import type { PkhPdfFillFunction } from "..";
import { pdfFillReducer } from "../../fillOutFunction";
import { nettoString, removeDecimalsFromCurrencyString } from "../../util";

export const zahlungsfrequenzMapping = {
  monthly: "Monatlich",
  quarterly: "Quartalsweise",
  yearly: "Jährlich",
  "one-time": "Einmalig",
};

export const fillStaatlicheLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.staatlicheLeistungenIsBuergergeld({ context: userData })) {
    pdfValues.ja_16.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11.value = `${removeDecimalsFromCurrencyString(userData.buergergeld)} ${nettoString}`;
  } else {
    pdfValues.nein_17.value = true;
  }

  if (guards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })) {
    pdfValues.ja_14.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10.value = `${removeDecimalsFromCurrencyString(userData.arbeitslosengeld)} ${nettoString}`;
  } else {
    pdfValues.nein_15.value = true;
  }
  return { pdfValues };
};

export const fillEinkommenType: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    guards.notEmployed({ context: userData }) ||
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData })
  ) {
    pdfValues.nein_10.value = true;
    pdfValues.nein_12.value = true;
  } else {
    if (guards.isEmployee({ context: userData })) {
      pdfValues.ja_9.value = true;
      pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro.value = `${removeDecimalsFromCurrencyString(userData.nettoEinkuenfteAlsArbeitnehmer)} ${nettoString}`;
    } else {
      pdfValues.nein_10.value = true;
    }
    if (guards.isSelfEmployed({ context: userData })) {
      pdfValues.ja_11.value = true;
      pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3.value = `${removeDecimalsFromCurrencyString(userData.selbststaendigMonatlichesEinkommen)} ${userData.selbststaendigBruttoNetto}`;
    } else {
      pdfValues.nein_12.value = true;
    }
  }
  return { pdfValues };
};

export const fillRente: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.receivesPension({ context: userData })
  ) {
    pdfValues.ja_12.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9.value = `${removeDecimalsFromCurrencyString(userData.pensionAmount)} ${nettoString}`;
  } else {
    pdfValues.nein_13.value = true;
  }
  return { pdfValues };
};

export const fillSupport: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    userData.unterhaltsanspruch === "unterhalt" &&
    userData.unterhaltssumme
  ) {
    pdfValues.ja_10.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8.value = `${removeDecimalsFromCurrencyString(userData.unterhaltssumme)} ${nettoString}`;
  } else {
    pdfValues.nein_11.value = true;
  }
  return { pdfValues };
};

export const fillAndereLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasWohngeld({ context: userData })
  ) {
    pdfValues.ja_19.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro7.value = `${removeDecimalsFromCurrencyString(userData.wohngeldAmount)} ${nettoString}`;
  } else {
    pdfValues.nein_20.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasKrankengeld({ context: userData })
  ) {
    pdfValues.ja_18.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12.value = `${removeDecimalsFromCurrencyString(userData.krankengeldAmount)} ${nettoString}`;
  } else {
    pdfValues.nein_19.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasElterngeld({ context: userData })
  ) {
    pdfValues.ja_20.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13.value = `${removeDecimalsFromCurrencyString(userData.elterngeldAmount)} ${nettoString}`;
  } else {
    pdfValues.nein_21.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasKindergeld({ context: userData })
  ) {
    pdfValues.ja_17.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6.value = `${removeDecimalsFromCurrencyString(userData.kindergeldAmount)} ${nettoString}`;
  } else {
    pdfValues.nein_18.value = true;
  }
  return { pdfValues };
};

export const fillWeitereEinkuenfte: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const hasAsylbewerberOrGrundsicherung =
    userData.staatlicheLeistungen === "asylbewerberleistungen" ||
    userData.staatlicheLeistungen === "grundsicherung";

  if (!userData.weitereEinkuenfte && !hasAsylbewerberOrGrundsicherung) {
    pdfValues.nein_22.value = true;
    return { pdfValues };
  }

  pdfValues.undefined_8.value = true;

  if (hasAsylbewerberOrGrundsicherung) {
    pdfValues[
      "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
    ].value =
      userData.staatlicheLeistungen === "asylbewerberleistungen"
        ? "Asylbewerberleistungen"
        : "Grundsicherung oder Sozialhilfe";
  }

  if (!userData.weitereEinkuenfte || userData.weitereEinkuenfte.length == 0)
    return { pdfValues };

  if (userData.weitereEinkuenfte.length > 2) {
    const attachment: AttachmentEntries = [];
    pdfValues[
      "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
    ].value = SEE_IN_ATTACHMENT_DESCRIPTION;

    attachment.push({ title: "2. Andere Einnahmen", level: "h3" });
    userData.weitereEinkuenfte.forEach((entry) => {
      attachment.push({
        title: entry.beschreibung,
        text: `${removeDecimalsFromCurrencyString(entry.betrag)} ${nettoString} (${zahlungsfrequenzMapping[entry.zahlungsfrequenz]})`,
      });
    });
    return { pdfValues, attachment };
  }

  pdfValues[
    "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
  ].value =
    userData.weitereEinkuenfte[0].beschreibung +
    ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[0].zahlungsfrequenz]})`;
  pdfValues.euroBrutto.value = `${removeDecimalsFromCurrencyString(userData.weitereEinkuenfte[0].betrag)} ${nettoString}`;

  if (userData.weitereEinkuenfte.length === 2) {
    pdfValues[
      "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
    ].value =
      userData.weitereEinkuenfte[1].beschreibung +
      ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[1].zahlungsfrequenz]})`;
    pdfValues.euroBrutto2.value = `${removeDecimalsFromCurrencyString(userData.weitereEinkuenfte[1].betrag)} ${nettoString}`;
  }

  return { pdfValues };
};

export const fillSelfBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    userData.staatlicheLeistungen === "grundsicherung" ||
    userData.staatlicheLeistungen === "asylbewerberleistungen"
  ) {
    pdfValues[
      "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
    ].value =
      userData.staatlicheLeistungen === "asylbewerberleistungen"
        ? "Asylbewerberleistungen"
        : "Grundsicherung oder Sozialhilfe";

    return { pdfValues };
  }

  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [
      fillStaatlicheLeistungen,
      fillEinkommenType,
      fillRente,
      fillSupport,
      fillAndereLeistungen,
      fillWeitereEinkuenfte,
    ],
  });

  pdfValues.nein_14.value = true;
  pdfValues.nein_16.value = true;
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "E Brutto Einnahmen", level: "h2" }, ...attachment]
        : [],
  };
};
