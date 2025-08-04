import { finanzielleAngabeEinkuenfteGuards as guards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import {
  type AttachmentEntries,
  SEE_IN_ATTACHMENT_DESCRIPTION,
} from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { removeDecimalsFromCurrencyString } from "~/util/strings";
import type { PkhPdfFillFunction } from "../../types";

export const zahlungsfrequenzMapping = {
  monthly: "Monatlich",
  quarterly: "Quartalsweise",
  yearly: "Jährlich",
  "one-time": "Einmalig",
};

export const nettoString = "netto";

export const fillStaatlicheLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (guards.staatlicheLeistungenIsBuergergeld({ context: userData })) {
    pdfValues.e20.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchBuergergeldinEuro.value = `${removeDecimalsFromCurrencyString(userData.buergergeld)} ${nettoString}`;
  } else {
    pdfValues.e19.value = true;
  }

  if (guards.staatlicheLeistungenIsArbeitslosengeld({ context: userData })) {
    pdfValues.e18.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchArbeitslosengeldinEuro.value = `${removeDecimalsFromCurrencyString(userData.arbeitslosengeld)} ${nettoString}`;
  } else {
    pdfValues.e17.value = true;
  }
  return { pdfValues };
};

export const fillEinkommenType: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.currentlyEmployed === "no") {
    pdfValues.e1.value = true;
    pdfValues.e3.value = true;
  }

  if (guards.isEmployee({ context: userData })) {
    pdfValues.e2.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro.value = `${removeDecimalsFromCurrencyString(userData.nettoEinkuenfteAlsArbeitnehmer)} ${nettoString}`;
  } else {
    pdfValues.e1.value = true;
  }

  if (guards.isSelfEmployed({ context: userData })) {
    pdfValues.e4.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur.value = `${removeDecimalsFromCurrencyString(userData.selbststaendigMonatlichesEinkommen)} ${userData.selbststaendigBruttoNetto}`;
  } else {
    pdfValues.e3.value = true;
  }

  // set "Vermietung und Verpachtung" and "Kapitalvermögen" to "Nein", they are also asked in "sonstige einnahmen"
  pdfValues.e5.value = true;
  pdfValues.e7.value = true;
  return { pdfValues };
};

export const fillRente: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.receivesPension === "yes") {
    pdfValues.e16.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchRentePensioninEuro.value = `${removeDecimalsFromCurrencyString(userData.pensionAmount)} ${nettoString}`;
  }
  if (userData.receivesPension === "no") {
    pdfValues.e15.value = true;
  }
  return { pdfValues };
};

const fillSupport: PkhPdfFillFunction = ({ userData, pdfValues }) => {
  if (userData.unterhaltsanspruch === "unterhalt") {
    pdfValues.e14.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchUnterhaltinEuro.value = `${removeDecimalsFromCurrencyString(userData.unterhaltsSumme)} ${nettoString}`;
  } else {
    pdfValues.e13.value = true;
  }
  return { pdfValues };
};

export const fillAndereLeistungen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (userData.hasWohngeld === "on") {
    pdfValues.e12.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro.value = `${removeDecimalsFromCurrencyString(userData.wohngeldAmount)} ${nettoString}`;
  } else if (userData.hasFurtherIncome) {
    pdfValues.e11.value = true;
  }

  if (userData.hasKrankengeld === "on") {
    pdfValues.e22.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchKrankengeldinEuro.value = `${removeDecimalsFromCurrencyString(userData.krankengeldAmount)} ${nettoString}`;
  } else if (userData.hasFurtherIncome) {
    pdfValues.e21.value = true;
  }

  if (userData.hasElterngeld === "on") {
    pdfValues.e24.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchElterngeldinEuro.value = `${removeDecimalsFromCurrencyString(userData.elterngeldAmount)} ${nettoString}`;
  } else if (userData.hasFurtherIncome) {
    pdfValues.e23.value = true;
  }

  if (userData.hasKindergeld === "on") {
    pdfValues.e10.value = true;
    pdfValues.monatlicheBruttoeinnahmendurchKindergeldKinderzuschlaginEuro.value = `${removeDecimalsFromCurrencyString(userData.kindergeldAmount)} ${nettoString}`;
  } else if (userData.hasFurtherIncome) {
    pdfValues.e9.value = true;
  }

  return { pdfValues };
};

export const fillWeitereEinkuenfte: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const hasAsylbewerberOrGrundsicherung =
    guards.hasGrundsicherungOrAsylbewerberleistungen({ context: userData });

  if (!userData.weitereEinkuenfte && !hasAsylbewerberOrGrundsicherung) {
    pdfValues.e25.value = true;
    return { pdfValues };
  }

  pdfValues.e26.value = true;

  if (hasAsylbewerberOrGrundsicherung) {
    pdfValues.andereEinnahmen1.value =
      userData.staatlicheLeistungen === "asylbewerberleistungen"
        ? "Asylbewerberleistungen"
        : "Grundsicherung oder Sozialhilfe";
  }

  if (!userData.weitereEinkuenfte || userData.weitereEinkuenfte.length == 0)
    return { pdfValues };

  if (userData.weitereEinkuenfte.length > 2) {
    const attachment: AttachmentEntries = [];
    pdfValues.andereEinnahmen1.value = SEE_IN_ATTACHMENT_DESCRIPTION;

    attachment.push({ title: "2. Andere Einnahmen", level: "h3" });
    userData.weitereEinkuenfte.forEach((entry) => {
      attachment.push({
        title: entry.beschreibung,
        text: `${removeDecimalsFromCurrencyString(entry.betrag)} ${nettoString} (${zahlungsfrequenzMapping[entry.zahlungsfrequenz]})`,
      });
    });
    return { pdfValues, attachment };
  }

  pdfValues.andereEinnahmen1.value =
    userData.weitereEinkuenfte[0].beschreibung +
    ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[0].zahlungsfrequenz]})`;
  pdfValues.bruttobezug1.value = `${removeDecimalsFromCurrencyString(userData.weitereEinkuenfte[0].betrag)} ${nettoString}`;

  if (userData.weitereEinkuenfte.length === 2) {
    pdfValues.andereEinnahmen2.value =
      userData.weitereEinkuenfte[1].beschreibung +
      ` (${zahlungsfrequenzMapping[userData.weitereEinkuenfte[1].zahlungsfrequenz]})`;
    pdfValues.bruttobezug2.value = `${removeDecimalsFromCurrencyString(userData.weitereEinkuenfte[1].betrag)} ${nettoString}`;
  }

  return { pdfValues };
};

export const fillOwnBruttoEinnahmen: PkhPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  if (
    userData.staatlicheLeistungen === "grundsicherung" ||
    userData.staatlicheLeistungen === "asylbewerberleistungen"
  ) {
    pdfValues.e26.value = true;
    pdfValues.andereEinnahmen1.value =
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

  return {
    pdfValues: filledValues,
    attachment:
      attachment.length > 0
        ? [{ title: "E Brutto Einnahmen", level: "h2" }, ...attachment]
        : [],
  };
};
