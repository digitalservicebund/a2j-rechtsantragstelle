import {
  finanzielleAngabeEinkuenfteGuards as guards,
  partnerEinkuenfteGuards as partnerGuards,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import { type AttachmentEntries, newPageHint } from "~/services/pdf/attachment";
import type { PkhPdfFillFunction } from ".";
import { pdfFillReducer } from "../fillOutFunction";

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

export const fillStaatlicheLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (partnerGuards.staatlicheLeistungenIsBuergergeld({ context: userData })) {
    pdfValues.ja_29.value = true;
    pdfValues.monatlicheBruttoeinnahmenH10.value = `${userData["partner-buergergeld"]} €`;
  } else {
    pdfValues.nein_30.value = true;
  }

  if (
    partnerGuards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })
  ) {
    pdfValues.ja_27.value = true;
    pdfValues.monatlicheBruttoeinnahmenH9.value = `${userData["partner-arbeitslosengeld"]} €`;
  } else {
    pdfValues.nein_28.value = true;
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

export const fillEinkommenTypePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    partnerGuards.notEmployed({ context: userData }) ||
    partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    pdfValues.nein_23.value = true;
    pdfValues.nein_25.value = true;
  } else {
    if (partnerGuards.isEmployee({ context: userData })) {
      pdfValues.ja_22.value = true;
      pdfValues.monatlicheBruttoeinnahmenH1.value = `${userData["partner-nettoEinkuenfteAlsArbeitnehmer"]} €`;
    } else {
      pdfValues.nein_23.value = true;
    }
    if (partnerGuards.isSelfEmployed({ context: userData })) {
      pdfValues.ja_24.value = true;
      pdfValues.monatlicheBruttoeinnahmenH2.value = `${userData["partner-selbststaendigMonatlichesEinkommen"]} € ${userData["partner-selbststaendigBruttoNetto"]}`;
    } else {
      pdfValues.nein_25.value = true;
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

export const fillRentePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.receivesPension({ context: userData })
  ) {
    pdfValues.ja_25.value = true;
    pdfValues.monatlicheBruttoeinnahmenH8.value = `${userData["partner-pensionAmount"]} €`;
  } else {
    pdfValues.nein_26.value = true;
  }
  return { pdfValues };
};

export const fillSupport: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData }) &&
    guards.receivesSupport({ context: userData })
  ) {
    pdfValues.ja_10.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9.value = `${userData.supportAmount} €`;
  } else {
    pdfValues.nein_11.value = true;
  }
  return { pdfValues };
};

export const fillSupportPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.receivesSupport({ context: userData })
  ) {
    pdfValues.ja_23.value = true;
    pdfValues.belegnummerH17.value = `${userData["partner-supportAmount"]} €`;
  } else {
    pdfValues.nein_24.value = true;
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

export const fillAndereLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.hasWohngeld({ context: userData })
  ) {
    pdfValues.ja_32.value = true;
    pdfValues.monatlicheBruttoeinnahmenH6.value = `${userData["partner-wohngeldAmount"]} €`;
  } else {
    pdfValues.nein_33.value = true;
  }
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.hasKrankengeld({ context: userData })
  ) {
    pdfValues.ja_31.value = true;
    pdfValues.monatlicheBruttoeinnahmenH11.value = `${userData["partner-krankengeldAmount"]} €`;
  } else {
    pdfValues.nein_32.value = true;
  }
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.hasElterngeld({ context: userData })
  ) {
    pdfValues.ja_33.value = true;
    pdfValues.monatlicheBruttoeinnahmenH12.value = `${userData["partner-elterngeldAmount"]} €`;
  } else {
    pdfValues.nein_34.value = true;
  }
  if (
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    partnerGuards.hasKindergeld({ context: userData })
  ) {
    pdfValues.ja_30.value = true;
    pdfValues.monatlicheBruttoeinnahmenH5.value = `${userData["partner-kindergeldAmount"]} €`;
  } else {
    pdfValues.nein_31.value = true;
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
    ].value = newPageHint;

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

export const fillWeitereEinkuenftePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !userData["partner-weitereEinkuenfte"] &&
    !partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    pdfValues.nein_35.value = true;
    return { pdfValues };
  }

  pdfValues.ja_35.value = true;

  if (
    partnerGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    pdfValues[
      "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
    ].value =
      userData["partner-staatlicheLeistungen"] === "asylbewerberleistungen"
        ? "Asylbewerberleistungen"
        : "Grundsicherung oder Sozialhilfe";
  }

  if (
    !userData["partner-weitereEinkuenfte"] ||
    userData["partner-weitereEinkuenfte"].length == 0
  )
    return { pdfValues };

  if (userData["partner-weitereEinkuenfte"].length > 2) {
    const attachment: AttachmentEntries = [];
    pdfValues[
      "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
    ].value = newPageHint;

    attachment.push({ title: "2. Andere Einnahmen", level: "h3" });
    userData["partner-weitereEinkuenfte"].forEach((entry) => {
      attachment.push({
        title: entry.beschreibung,
        text: `${entry.betrag} € (${zahlungsfrequenzMapping[entry.zahlungsfrequenz]})`,
      });
    });
    return { pdfValues, attachment };
  }

  pdfValues[
    "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
  ].value =
    userData["partner-weitereEinkuenfte"][0].beschreibung +
    ` (${zahlungsfrequenzMapping[userData["partner-weitereEinkuenfte"][0].zahlungsfrequenz]})`;
  pdfValues.euroBrutto3.value = `${userData["partner-weitereEinkuenfte"][0].betrag} €`;

  if (userData["partner-weitereEinkuenfte"].length === 2) {
    pdfValues[
      "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2"
    ].value =
      userData["partner-weitereEinkuenfte"][1].beschreibung +
      ` (${zahlungsfrequenzMapping[userData["partner-weitereEinkuenfte"][1].zahlungsfrequenz]})`;
    pdfValues.euroBrutto4.value = `${userData["partner-weitereEinkuenfte"][1].betrag} €`;
  }

  return { pdfValues };
};

export const fillBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [fillSelfBruttoEinnahmen, fillPartnerBruttoEinnahmen],
  });
  return {
    pdfValues: filledValues,
    attachment,
  };
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

export const fillPartnerBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { pdfValues: filledValues, attachment } = pdfFillReducer({
    userData,
    pdfParams: pdfValues,
    fillFunctions: [
      fillStaatlicheLeistungenPartner,
      fillEinkommenTypePartner,
      fillRentePartner,
      fillSupportPartner,
      fillAndereLeistungenPartner,
      fillWeitereEinkuenftePartner,
    ],
  });

  pdfValues.nein_27.value = true;
  pdfValues.nein_29.value = true;
  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [
            { title: "E Brutto Einnahmen - Partner:in", level: "h2" },
            ...attachment,
          ]
        : [],
  };
};
