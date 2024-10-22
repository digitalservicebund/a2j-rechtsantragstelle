import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import {
  attachBankkontenToAnhang,
  attachGrundeigentumToAnhang,
  eigentuemerMapping,
  grundeigentumArtMapping,
} from "~/services/pdf/shared/eigentumHelpers";
import { arrayIsNonEmpty } from "~/util/array";
import { fillKraftfahrzeug } from "./fillKraftfahrzeug";
import type { BerHPdfFillFunction } from "../..";
import { fillVermoegenswerte } from "./fillVermoegenswerte";
import type { AttachmentEntries } from "../../../attachment";
import { newPageHint } from "../../../attachment";

export const fillBesitz: BerHPdfFillFunction = ({ userData, pdfValues }) => {
  const attachment: AttachmentEntries = [];

  const { pdfValues: besitzPdfValues, attachment: besitzAttachment } =
    pdfFillReducer({
      userData,
      pdfParams: pdfValues,
      fillFunctions: [
        fillFinancialBankkonto,
        fillFinancialGrundeigentum,
        fillKraftfahrzeug,
        fillVermoegenswerte,
      ],
    });

  if (besitzAttachment.length > 0) {
    attachment.push({
      title: "Feld F: Eigentum",
      level: "h2",
    });

    besitzAttachment.forEach((entry) => {
      attachment.push(entry);
    });
  }
  return { pdfValues: besitzPdfValues, attachment };
};

export const fillFinancialBankkonto: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  let attachment: AttachmentEntries = [];
  pdfValues.f1Konten1.value = userData.hasBankkonto === "no";
  pdfValues.f1Konten2.value = userData.hasBankkonto === "yes";

  const { bankkonten } = userData;
  if (!arrayIsNonEmpty(bankkonten)) return { pdfValues };

  if (bankkonten.length == 1) {
    const bankkonto = bankkonten[0];
    pdfValues.f1InhaberA.value = bankkonto.kontoEigentuemer == "myself";
    pdfValues.f2InhaberB.value = bankkonto.kontoEigentuemer == "partner";
    pdfValues.f2InhaberC.value =
      bankkonto.kontoEigentuemer == "myselfAndPartner";

    pdfValues.f3Bank1.value = `Bank: ${bankkonto.bankName}`;
    if (bankkonto.kontoDescription)
      pdfValues.f3Bank1.value += `\nBezeichnung: ${bankkonto.kontoDescription}`;
    if (bankkonto.kontoEigentuemer === "myselfAndSomeoneElse")
      pdfValues.f3Bank1.value += `\nInhaber: ${eigentuemerMapping[bankkonto.kontoEigentuemer]}`;
    if (bankkonto.iban) pdfValues.f3Bank1.value += `\nIBAN: ${bankkonto.iban}`;

    pdfValues.f4Kontostand.value = bankkonto.kontostand + " €";
  } else {
    pdfValues.f3Bank1.value = newPageHint;

    ({ attachment } = attachBankkontenToAnhang([], bankkonten));
  }
  return { pdfValues, attachment };
};

export const fillFinancialGrundeigentum: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const { eigentumTotalWorth, grundeigentum: grundeigentumArray } = userData;
  pdfValues.f5Grundeigentum1.value = userData.hasGrundeigentum === "no";
  pdfValues.f5Grundeigentum2.value = userData.hasGrundeigentum === "yes";

  const shouldPrintNote = eigentumTotalWorth === "less10000";

  if (shouldPrintNote) {
    pdfValues.f7Nutzungsart.value =
      "Übergreifender Hinweis zu allen Vermögenswerten: Mein gesamtes Vermögen ist insgesamt weniger als 10.000€ wert.";
  }

  if (!arrayIsNonEmpty(grundeigentumArray)) return { pdfValues };

  if (grundeigentumArray.length === 1 && !shouldPrintNote) {
    const grundeigentum = grundeigentumArray[0];

    pdfValues.f6EigentuemerA.value = grundeigentum.eigentuemer == "myself";
    pdfValues.f6EigentuemerB.value = grundeigentum.eigentuemer == "partner";
    pdfValues.f6EigentuemerC.value =
      grundeigentum.eigentuemer == "myselfAndPartner";

    pdfValues.f7Nutzungsart.value = `Art: ${grundeigentum.art ? grundeigentumArtMapping[grundeigentum.art] : ""}`;
    if (grundeigentum.isBewohnt === "yes")
      pdfValues.f7Nutzungsart.value += ", Eigennutzung";
    else if (grundeigentum.isBewohnt === "family")
      pdfValues.f7Nutzungsart.value += ", Bewohnt von Familie";

    pdfValues.f7Nutzungsart.value += `, Fläche: ${grundeigentum.flaeche} m²`;

    if (grundeigentum.eigentuemer === "myselfAndSomeoneElse")
      pdfValues.f7Nutzungsart.value += `, Eigentümer: ${eigentuemerMapping[grundeigentum.eigentuemer]}`;

    pdfValues.f8Verkehrswert.value = grundeigentum.verkaufswert + " €";
  } else {
    pdfValues.f7Nutzungsart.value = pdfValues.f7Nutzungsart.value
      ? newPageHint + "\n" + pdfValues.f7Nutzungsart.value
      : newPageHint;

    const { attachment } = attachGrundeigentumToAnhang(grundeigentumArray);
    return { pdfValues, attachment };
  }
  return { pdfValues };
};
