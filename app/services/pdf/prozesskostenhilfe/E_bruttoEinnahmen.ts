import { finanzielleAngabeEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
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
    guards.notEmployed({ context: userData }) ||
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData })
  ) {
    pdfValues.nein_10.value = true;
    pdfValues.nein_12.value = true;
  } else {
    if (guards.isEmployee({ context: userData })) {
      pdfValues.ja_9.value = true;
      pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro.value = `${userData.nettoEinkuenfteAlsArbeitnehmer}€`;
    } else {
      pdfValues.nein_10.value = true;
    }
    if (guards.isSelfEmployed({ context: userData })) {
      pdfValues.ja_11.value = true;
      // TODO: shrink field font size
      pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3.value = `${userData.selbststaendigMonatlichesEinkommen}€ ${userData.selbststaendigBruttoNetto}`;
    } else {
      pdfValues.nein_12.value = true;
    }
  }
  return { pdfValues };
};

export const fillRente: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (guards.receivesPension({ context: userData })) {
    pdfValues.ja_12.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8.value = `${userData.pensionAmount}€`;
  } else {
    pdfValues.nein_13.value = true;
  }
  return { pdfValues };
};

export const fillSupport: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (guards.receivesSupport({ context: userData })) {
    pdfValues.ja_10.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9.value = `${userData.supportAmount}€`;
  } else {
    pdfValues.nein_11.value = true;
  }
  return { pdfValues };
};

export const fillAndereLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.hasWohngeld({ context: userData })) {
    pdfValues.ja_19.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro7.value = `${userData.wohngeldAmount}€`;
  } else {
    pdfValues.nein_20.value = true;
  }
  if (guards.hasKrankengeld({ context: userData })) {
    pdfValues.ja_18.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12.value = `${userData.krankengeldAmount}€`;
  } else {
    pdfValues.nein_19.value = true;
  }
  if (guards.hasElterngeld({ context: userData })) {
    pdfValues.ja_20.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13.value = `${userData.elterngeldAmount}€`;
  } else {
    pdfValues.nein_21.value = true;
  }
  if (guards.hasKindergeld({ context: userData })) {
    pdfValues.ja_17.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6.value = `${userData.kindergeldAmount}€`;
  } else {
    pdfValues.nein_18.value = true;
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
    fillFunctions: [
      fillStaatlicheLeistungen,
      fillEinkommenType,
      fillRente,
      fillSupport,
      fillAndereLeistungen,
    ],
  });
};
