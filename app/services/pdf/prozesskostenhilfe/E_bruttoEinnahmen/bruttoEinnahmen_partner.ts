import { partnerEinkuenfteGuards as guards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import type { PkhPdfFillFunction } from "~/services/pdf/prozesskostenhilfe";
import { zahlungsfrequenzMapping } from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export const fillStaatlicheLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.staatlicheLeistungenIsBuergergeld({ context: userData })) {
    pdfValues.ja_29.value = true;
    pdfValues.monatlicheBruttoeinnahmenH10.value = `${userData["partner-buergergeld"]} €`;
  } else {
    pdfValues.nein_30.value = true;
  }

  if (guards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })) {
    pdfValues.ja_27.value = true;
    pdfValues.monatlicheBruttoeinnahmenH9.value = `${userData["partner-arbeitslosengeld"]} €`;
  } else {
    pdfValues.nein_28.value = true;
  }
  return { pdfValues };
};

export const fillEinkommenTypePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    guards.notEmployed({ context: userData }) ||
    guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    pdfValues.nein_23.value = true;
    pdfValues.nein_25.value = true;
  } else {
    if (guards.isEmployee({ context: userData })) {
      pdfValues.ja_22.value = true;
      pdfValues.monatlicheBruttoeinnahmenH1.value = `${userData["partner-nettoEinkuenfteAlsArbeitnehmer"]} €`;
    } else {
      pdfValues.nein_23.value = true;
    }
    if (guards.isSelfEmployed({ context: userData })) {
      pdfValues.ja_24.value = true;
      pdfValues.monatlicheBruttoeinnahmenH2.value = `${userData["partner-selbststaendigMonatlichesEinkommen"]} € ${userData["partner-selbststaendigBruttoNetto"]}`;
    } else {
      pdfValues.nein_25.value = true;
    }
  }
  return { pdfValues };
};

export const fillRentePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.receivesPension({ context: userData })
  ) {
    pdfValues.ja_25.value = true;
    pdfValues.monatlicheBruttoeinnahmenH8.value = `${userData["partner-pensionAmount"]} €`;
  } else {
    pdfValues.nein_26.value = true;
  }
  return { pdfValues };
};

export const fillSupportPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.receivesSupport({ context: userData })
  ) {
    pdfValues.ja_23.value = true;
    pdfValues.monatlicheBruttoeinnahmenH7.value = `${userData["partner-supportAmount"]} €`;
  } else {
    pdfValues.nein_24.value = true;
  }
  return { pdfValues };
};

export const fillAndereLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.hasWohngeld({ context: userData })
  ) {
    pdfValues.ja_32.value = true;
    pdfValues.monatlicheBruttoeinnahmenH6.value = `${userData["partner-wohngeldAmount"]} €`;
  } else {
    pdfValues.nein_33.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.hasKrankengeld({ context: userData })
  ) {
    pdfValues.ja_31.value = true;
    pdfValues.monatlicheBruttoeinnahmenH11.value = `${userData["partner-krankengeldAmount"]} €`;
  } else {
    pdfValues.nein_32.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.hasElterngeld({ context: userData })
  ) {
    pdfValues.ja_33.value = true;
    pdfValues.monatlicheBruttoeinnahmenH12.value = `${userData["partner-elterngeldAmount"]} €`;
  } else {
    pdfValues.nein_34.value = true;
  }
  if (
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    }) &&
    guards.hasKindergeld({ context: userData })
  ) {
    pdfValues.ja_30.value = true;
    pdfValues.monatlicheBruttoeinnahmenH5.value = `${userData["partner-kindergeldAmount"]} €`;
  } else {
    pdfValues.nein_31.value = true;
  }
  return { pdfValues };
};

export const fillWeitereEinkuenftePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    !userData["partner-weitereEinkuenfte"] &&
    !guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    })
  ) {
    pdfValues.nein_35.value = true;
    return { pdfValues };
  }

  pdfValues.ja_35.value = true;

  if (
    guards.hasGrundsicherungOrAsylbewerberleistungen({
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
    ].value = SEE_IN_ATTACHMENT_DESCRIPTION;

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

export const fillBesondersHoheAusgabenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  if (
    userData["partnerHasBesondersAusgaben"] === "yes" &&
    userData["partnerBesondersAusgabe"] &&
    objectKeysNonEmpty(userData["partnerBesondersAusgabe"], [
      "beschreibung",
      "betrag",
    ])
  ) {
    attachment.push({ title: "Besonders Hohe Ausgaben", level: "h3" });
    attachment.push({
      title: userData["partnerBesondersAusgabe"]["beschreibung"],
      text: `${userData["partnerBesondersAusgabe"]["betrag"]} € ${zahlungsfrequenzMapping["monthly"]}`,
    });
  }
  return { pdfValues, attachment };
};

export const fillBruttoEinnahmenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
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
      fillStaatlicheLeistungenPartner,
      fillEinkommenTypePartner,
      fillRentePartner,
      fillSupportPartner,
      fillAndereLeistungenPartner,
      fillWeitereEinkuenftePartner,
      fillBesondersHoheAusgabenPartner,
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
