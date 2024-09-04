import {
  hasGrundsicherungOrAsylbewerberleistungen,
  isEmployee,
  isSelfEmployed,
  notEmployed,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import {
  pdfFillReducer,
  type PkhPdfFillFunction,
} from "~/services/pdf/prozesskostenhilfe/fillOutFunction";

export const fillStaatlicheLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    userData.staatlicheLeistungenPKH === "asylbewerberleistungen" ||
    userData.staatlicheLeistungenPKH === "grundsicherung"
  ) {
    pdfValues.undefined_8.value = true;
    if (userData.staatlicheLeistungenPKH === "asylbewerberleistungen") {
      pdfValues[
        "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
      ].value = "Asylbewerberleistungen";
    }
    if (userData.staatlicheLeistungenPKH === "grundsicherung") {
      pdfValues[
        "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
      ].value = "Grundsicherung oder Sozialhilfe";
    }
  } else {
    pdfValues.nein_22.value = true;
  }

  if (userData.staatlicheLeistungenPKH === "buergergeld") {
    pdfValues.ja_16.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11.value = `${userData.buergergeld}€`;
  } else {
    pdfValues.nein_17.value = true;
  }

  if (userData.staatlicheLeistungenPKH === "arbeitslosengeld") {
    pdfValues.ja_14.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10.value = `${userData.arbeitslosengeld}€`;
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
    notEmployed({ context: userData }) ||
    hasGrundsicherungOrAsylbewerberleistungen({ context: userData })
  ) {
    pdfValues.nein_10.value = true;
    pdfValues.nein_12.value = true;
  } else {
    if (isEmployee({ context: userData })) {
      pdfValues.ja_9.value = true;
      pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro.value = `${userData.nettoEinkuenfteAlsArbeitnehmer}€`;
    } else {
      pdfValues.nein_10.value = true;
    }
    if (isSelfEmployed({ context: userData })) {
      pdfValues.ja_11.value = true;
      // TODO: shrink field font size
      pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3.value = `${userData.selbststaendigMonatlichesEinkommen}€ ${userData.selbststaendigBruttoNetto}`;
    } else {
      pdfValues.nein_12.value = true;
    }
  }
  return { pdfValues };
};

export const fillBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  return pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillStaatlicheLeistungen, fillEinkommenType],
  });
};
