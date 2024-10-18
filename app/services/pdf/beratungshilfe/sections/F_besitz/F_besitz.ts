import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { arrayIsNonEmpty } from "~/util/array";
import { fillKraftfahrzeug } from "./fillKraftfahrzeug";
import type { BerHPdfFillFunction } from "../..";
import { fillVermoegenswerte } from "./fillVermoegenswerte";
import type { AttachmentEntries } from "../../../attachment";
import { newPageHint } from "../../../attachment";
import { eigentuemerMapping } from "../../eigentuemerMapping";

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
  const attachment: AttachmentEntries = [];
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

    attachment.push({
      title: "Bankkonten",
      level: "h3",
    });

    bankkonten.forEach(
      (
        { bankName, kontoEigentuemer, kontostand, kontoDescription, iban },
        index,
      ) => {
        attachment.push(
          { title: `Bankkonto ${index + 1}`, level: "h4" },
          { title: "Bank", text: bankName },
          { title: "Inhaber", text: eigentuemerMapping[kontoEigentuemer] },
          { title: "Kontostand", text: kontostand + " €" },
        );

        if (kontoDescription)
          attachment.push({ title: "Beschreibung", text: kontoDescription });
        if (iban) attachment.push({ title: "Iban", text: iban });
      },
    );
  }
  return { pdfValues, attachment };
};

export const fillFinancialGrundeigentum: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  const { eigentumTotalWorth, grundeigentum: grundeigentumArray } = userData;
  pdfValues.f5Grundeigentum1.value = userData.hasGrundeigentum === "no";
  pdfValues.f5Grundeigentum2.value = userData.hasGrundeigentum === "yes";

  const shouldPrintNote = eigentumTotalWorth === "less10000";

  if (shouldPrintNote) {
    pdfValues.f7Nutzungsart.value =
      "Übergreifender Hinweis zu allen Vermögenswerten: Mein gesamtes Vermögen ist insgesamt weniger als 10.000€ wert.";
  }

  if (!arrayIsNonEmpty(grundeigentumArray)) return { pdfValues };

  const grundeigentumArtMapping = {
    eigentumswohnung: "Wohnung",
    einfamilienhaus: "Haus für Familie",
    mehrereWohnungen: "Haus mit mehreren Wohnungen",
    unbebaut: "Grundstück",
    erbbaurecht: "Erbbaurecht",
    garage: "Garagen(-hof)",
  } as const;

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

    attachment.push({
      title: "Grundeigentum",
      level: "h3",
    });

    grundeigentumArray.forEach((grundeigentum, index) => {
      attachment.push(
        { title: `Grundeigentum ${index + 1}`, level: "h4" },
        {
          title: "Art",
          text: grundeigentum.art
            ? grundeigentumArtMapping[grundeigentum.art]
            : "",
        },
        {
          title: "Eigentümer:in",
          text: grundeigentum.eigentuemer
            ? eigentuemerMapping[grundeigentum.eigentuemer]
            : "",
        },
        { title: "Fläche", text: grundeigentum.flaeche + " m²" },
        { title: "Verkehrswert", text: grundeigentum.verkaufswert + " €" },
      );
      if (grundeigentum.isBewohnt === "yes")
        attachment.push({ title: "Eigennutzung", text: "Ja" });
      else if (grundeigentum.isBewohnt === "family")
        attachment.push({ title: "Eigennutzung", text: "Von Familie" });
    });
  }
  return { pdfValues, attachment };
};
