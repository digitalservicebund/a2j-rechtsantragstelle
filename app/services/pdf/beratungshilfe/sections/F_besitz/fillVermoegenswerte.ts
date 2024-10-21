import { type AttachmentEntries, newPageHint } from "~/services/pdf/attachment";
import type { BerHPdfFillFunction } from "../..";
import {
  eigentuemerMapping,
  fillSingleGeldanlage,
  fillSingleWertsache,
  geldanlageArtMapping,
} from "../../../shared/eigentumHelpers";

export const befristungMapping = {
  lifeInsurance: "Lebensversicherung",
  buildingSavingsContract: "Bausparvertrag",
  fixedDepositAccount: "Festgeldkonto",
};
const VERMOEGENSWERT_BEZEICHNUNG_FIELD_MAX_CHARS = 148;
const VERMOEGENSWERT_BEZEICHNUNG_FIELD_MAX_NEW_LINES = 3;

export const fillVermoegenswerte: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  const attachment: AttachmentEntries = [];
  const wertsachen = userData.wertsachen ?? [];
  const geldanlagen = userData.geldanlagen ?? [];
  const totalVermoegenswerteCount = wertsachen.length + geldanlagen.length;

  const hasVermoegenswerte = totalVermoegenswerteCount > 0;
  pdfValues.f13Vermoegenswerte1.value =
    userData.hasWertsache === "no" && userData.hasGeldanlage === "no";
  pdfValues.f13Vermoegenswerte2.value =
    userData.hasWertsache === "yes" || userData.hasGeldanlage === "yes";

  if (!hasVermoegenswerte) return { pdfValues };

  const singleGeldanlage = geldanlagen[0];
  const singleWertsache = wertsachen[0];
  const singleVermoegenswert = singleGeldanlage ?? singleWertsache;
  const singleVermoegenswertString = singleGeldanlage
    ? fillSingleGeldanlage(singleGeldanlage)
    : fillSingleWertsache(singleWertsache);

  const overflowDueToMaxChars =
    singleVermoegenswertString.length >
    VERMOEGENSWERT_BEZEICHNUNG_FIELD_MAX_CHARS;
  const overflowDueToMaxNewLines =
    singleVermoegenswertString.split("\n").length >
    VERMOEGENSWERT_BEZEICHNUNG_FIELD_MAX_NEW_LINES;

  if (
    totalVermoegenswerteCount == 1 &&
    !overflowDueToMaxChars &&
    !overflowDueToMaxNewLines
  ) {
    pdfValues.f14InhaberA.value = singleVermoegenswert.eigentuemer == "myself";
    pdfValues.f14InhaberB.value = singleVermoegenswert.eigentuemer == "partner";
    pdfValues.f14VermoegenswerteC.value =
      singleVermoegenswert.eigentuemer == "myselfAndPartner";

    pdfValues.f15Bezeichnung.value = singleVermoegenswertString;
    pdfValues.f16RueckkaufswertoderVerkehrswertinEUR.value =
      singleVermoegenswert.wert;
  } else {
    pdfValues.f15Bezeichnung.value = newPageHint;
    attachment.push({
      title: "Sonstige Vermögenswerte",
      level: "h3",
    });
    geldanlagen.forEach((geldanlage, index) => {
      const geldanlageArt = geldanlage.art
        ? geldanlageArtMapping[geldanlage.art]
        : "";
      const geldanlageEigentumer = geldanlage.eigentuemer
        ? eigentuemerMapping[geldanlage.eigentuemer]
        : "";
      attachment.push(
        { title: `Geldanlage ${index + 1}`, level: "h4" },
        { title: "Art", text: geldanlageArt },
        { title: "Wert", text: geldanlage.wert },
        {
          title: "Eigentümer:in",
          text: geldanlageEigentumer,
        },
      );
      if (geldanlage.auszahlungdatum)
        attachment.push({
          title: "Auszahlungsdatum",
          text: geldanlage.auszahlungdatum,
        });
      if (geldanlage.befristetArt)
        attachment.push({
          title: "Art der Befristung",
          text: befristungMapping[geldanlage.befristetArt],
        });
      if (geldanlage.forderung)
        attachment.push({ title: "Forderung", text: geldanlage.forderung });
      if (geldanlage.verwendungszweck)
        attachment.push({
          title: "Verwendungszweck",
          text: geldanlage.verwendungszweck,
        });
      if (geldanlage.kontoBankName)
        attachment.push({
          title: "Name der Bank",
          text: geldanlage.kontoBankName,
        });
      if (geldanlage.kontoBezeichnung)
        attachment.push({
          title: "Bezeichnung",
          text: geldanlage.kontoBezeichnung,
        });
      if (geldanlage.kontoIban)
        attachment.push({
          title: "IBAN",
          text: geldanlage.kontoIban,
        });
    });
    wertsachen.forEach((wertsache, index) => {
      attachment.push(
        { title: `Wertsache ${index + 1}`, level: "h4" },
        { title: "Art", text: wertsache.art },
        { title: "Wert", text: wertsache.wert },
        {
          title: "Eigentümer:in",
          text: eigentuemerMapping[wertsache.eigentuemer],
        },
      );
    });
  }
  return { pdfValues, attachment };
};
