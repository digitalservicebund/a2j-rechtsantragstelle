import { partnerEinkuenfteGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { removeDecimalsFromCurrencyString } from "~/util/strings";
import {
  nettoString,
  zahlungsfrequenzMapping,
} from "./bruttoEinnahmen_eigenes";
import type { PkhPdfFillFunction } from "../../types";

export const fillStaatlicheLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.staatlicheLeistungenIsBuergergeld({ context: userData })) {
    pdfValues.e46.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchBuergergeldinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-buergergeld"])} ${nettoString}`;
  } else {
    pdfValues.e45.value = true;
  }

  if (guards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })) {
    pdfValues.e44.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchArbeitslosengeldinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-arbeitslosengeld"])} ${nettoString}`;
  } else {
    pdfValues.e43.value = true;
  }
  return { pdfValues };
};

export const fillEinkommenTypePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.notEmployed({ context: userData })) {
    pdfValues.e27.value = true;
    pdfValues.e29.value = true;
  }

  if (guards.isEmployee({ context: userData })) {
    pdfValues.e28.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchnichtselbstaendigeArbeitinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-nettoEinkuenfteAlsArbeitnehmer"])} ${nettoString}`;
  } else {
    pdfValues.e27.value = true;
  }

  if (guards.isSelfEmployed({ context: userData })) {
    pdfValues.e30.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchselbstaendigeArbeitGewerbebetriebLandundFors.value = `${removeDecimalsFromCurrencyString(userData["partner-selbststaendigMonatlichesEinkommen"])} ${userData["partner-selbststaendigBruttoNetto"]}`;
  } else {
    pdfValues.e29.value = true;
  }

  // set "Vermietung und Verpachtung" and "Kapitalvermögen" to "Nein", they are also asked in "sonstige einnahmen"
  pdfValues.e31.value = true;
  pdfValues.e33.value = true;

  return { pdfValues };
};

export const fillRentePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData["partner-receivesPension"] === "yes") {
    pdfValues.e42.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchRentePensioninEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-pensionAmount"])} ${nettoString}`;
  }
  if (userData["partner-receivesPension"] === "no") {
    pdfValues.e41.value = true;
  }
  return { pdfValues };
};

export const fillSupportPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData["partner-receivesSupport"] === "yes") {
    pdfValues.e40.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchUnterhaltinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-supportAmount"])} ${nettoString}`;
  }
  if (userData["partner-receivesSupport"] === "no") {
    pdfValues.e39.value = true;
  }
  return { pdfValues };
};

export const fillAndereLeistungenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.partnerLeistungen?.wohngeld === "on") {
    pdfValues.e38.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchWohngeldinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-wohngeldAmount"])} ${nettoString}`;
  } else if (userData["partner-hasFurtherIncome"]) {
    pdfValues.e37.value = true;
  }

  if (userData.partnerLeistungen?.krankengeld === "on") {
    pdfValues.e48.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchKrankengeldinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-krankengeldAmount"])} ${nettoString}`;
  } else if (userData["partner-hasFurtherIncome"]) {
    pdfValues.e47.value = true;
  }

  if (userData.partnerLeistungen?.elterngeld === "on") {
    pdfValues.e50.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchElterngeldinEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-elterngeldAmount"])} ${nettoString}`;
  } else if (userData["partner-hasFurtherIncome"]) {
    pdfValues.e49.value = true;
  }

  if (userData.partnerLeistungen?.kindergeld === "on") {
    pdfValues.e36.value = true;
    pdfValues.monatlicheBruttoeinnahmenPartnerPartnerindurchKindergeldKinderzuschlaginEuro.value = `${removeDecimalsFromCurrencyString(userData["partner-kindergeldAmount"])} ${nettoString}`;
  } else if (userData["partner-hasFurtherIncome"]) {
    pdfValues.e35.value = true;
  }

  return { pdfValues };
};

export const fillWeitereEinkuenftePartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const hasAsylbewerberOrGrundsicherung =
    guards.hasGrundsicherungOrAsylbewerberleistungen({
      context: userData,
    });

  if (
    !userData["partner-weitereEinkuenfte"] &&
    !hasAsylbewerberOrGrundsicherung
  ) {
    pdfValues.e51.value = true;
    return { pdfValues };
  }

  pdfValues.e52.value = true;

  if (hasAsylbewerberOrGrundsicherung) {
    pdfValues.andereEinnahmenPartnerPartnerin1.value =
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
    pdfValues.andereEinnahmenPartnerPartnerin1.value =
      SEE_IN_ATTACHMENT_DESCRIPTION;

    attachment.push({ title: "2. Andere Einnahmen", level: "h3" });
    userData["partner-weitereEinkuenfte"].forEach((entry) => {
      attachment.push({
        title: entry.beschreibung,
        text: `${removeDecimalsFromCurrencyString(entry.betrag)} ${nettoString} (${zahlungsfrequenzMapping[entry.zahlungsfrequenz]})`,
      });
    });
    return { pdfValues, attachment };
  }

  pdfValues.andereEinnahmenPartnerPartnerin1.value =
    userData["partner-weitereEinkuenfte"][0].beschreibung +
    ` (${zahlungsfrequenzMapping[userData["partner-weitereEinkuenfte"][0].zahlungsfrequenz]})`;
  pdfValues.bruttobezugPartnerPartnerin1.value = `${removeDecimalsFromCurrencyString(userData["partner-weitereEinkuenfte"][0].betrag)} ${nettoString}`;

  if (userData["partner-weitereEinkuenfte"].length === 2) {
    pdfValues.andereEinnahmenPartnerPartnerin2.value =
      userData["partner-weitereEinkuenfte"][1].beschreibung +
      ` (${zahlungsfrequenzMapping[userData["partner-weitereEinkuenfte"][1].zahlungsfrequenz]})`;
    pdfValues.bruttobezugPartnerPartnerin2.value = `${removeDecimalsFromCurrencyString(userData["partner-weitereEinkuenfte"][1].betrag)} ${nettoString}`;
  }

  return { pdfValues };
};

export const fillBesondersHoheAusgabenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  if (
    userData.partnerHasBesondersAusgaben === "yes" &&
    userData.partnerBesondersAusgabe &&
    objectKeysNonEmpty(userData.partnerBesondersAusgabe, [
      "beschreibung",
      "betrag",
    ])
  ) {
    attachment.push({ title: "Besonders Hohe Ausgaben", level: "h3" });
    attachment.push({
      title: userData.partnerBesondersAusgabe.beschreibung,
      text: `${removeDecimalsFromCurrencyString(userData.partnerBesondersAusgabe.betrag)} ${nettoString} ${zahlungsfrequenzMapping.monthly}`,
    });
  }
  return { pdfValues, attachment };
};

export const fillBruttoEinnahmenPartner: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.partnerschaft !== "yes" || userData.partnerEinkommen === "no") {
    return { pdfValues };
  }

  if (
    userData["partner-staatlicheLeistungen"] === "grundsicherung" ||
    userData["partner-staatlicheLeistungen"] === "asylbewerberleistungen"
  ) {
    pdfValues.e52.value = true;
    pdfValues.andereEinnahmenPartnerPartnerin1.value =
      userData["partner-staatlicheLeistungen"] === "asylbewerberleistungen"
        ? "Asylbewerberleistungen"
        : "Grundsicherung oder Sozialhilfe";
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
