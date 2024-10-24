import { finanzielleAngabeEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/services/pdf/attachment";
import type { PkhPdfFillFunction } from "..";
import { pdfFillReducer } from "../../fillOutFunction";

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
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11.value = `${userData.buergergeld} €`;
  } else {
    pdfValues.nein_17.value = true;
  }

  if (guards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })) {
    pdfValues.ja_14.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10.value = `${userData.arbeitslosengeld} €`;
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
      pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro.value = `${userData.nettoEinkuenfteAlsArbeitnehmer} €`;
    } else {
      pdfValues.nein_10.value = true;
    }
    if (guards.isSelfEmployed({ context: userData })) {
      pdfValues.ja_11.value = true;
      pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3.value = `${userData.selbststaendigMonatlichesEinkommen} € ${userData.selbststaendigBruttoNetto}`;
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
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8.value = `${userData.pensionAmount} €`;
  } else {
    pdfValues.nein_13.value = true;
  }
  return { pdfValues };
};

export const fillSupport: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    userData.unterhaltsanspruch === "unterhalt" &&
    userData.unterhaltsSumme
  ) {
    pdfValues.ja_10.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9.value = `${userData.unterhaltsSumme} €`;
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
    pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro7.value = `${userData.wohngeldAmount} €`;
  } else {
    pdfValues.nein_20.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasKrankengeld({ context: userData })
  ) {
    pdfValues.ja_18.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12.value = `${userData.krankengeldAmount} €`;
  } else {
    pdfValues.nein_19.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasElterngeld({ context: userData })
  ) {
    pdfValues.ja_20.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13.value = `${userData.elterngeldAmount} €`;
  } else {
    pdfValues.nein_21.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.hasKindergeld({ context: userData })
  ) {
    pdfValues.ja_17.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6.value = `${userData.kindergeldAmount} €`;
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
        text: `${entry.betrag} € (${zahlungsfrequenzMapping[entry.zahlungsfrequenz]})`,
      });
    });
    return { pdfValues, attachment };
  }

  pdfValues[
    "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
  ].value =
    userData.weitereEinkuenfte[0].beschreibung +
    ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[0].zahlungsfrequenz]})`;
  pdfValues.euroBrutto.value = `${userData.weitereEinkuenfte[0].betrag} €`;

  if (userData.weitereEinkuenfte.length === 2) {
    pdfValues[
      "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
    ].value =
      userData.weitereEinkuenfte[1].beschreibung +
      ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[1].zahlungsfrequenz]})`;
    pdfValues.euroBrutto2.value = `${userData.weitereEinkuenfte[1].betrag} €`;
  }

  return { pdfValues };
};

export const fillSelfBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
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
