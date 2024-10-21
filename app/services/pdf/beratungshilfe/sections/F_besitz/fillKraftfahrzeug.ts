import {
  verkaufswertMappingDescription,
  fillSingleKraftfahrzeug,
  attachKraftfahrzeugeToAnhang,
} from "~/services/pdf/shared/eigentumHelpers";
import type { BerHPdfFillFunction } from "../..";
import { newPageHint, type AttachmentEntries } from "../../../attachment";

const KRAFTFAHRZEUG_ART_FIELD_MAX_CHARS = 96;

export const fillKraftfahrzeug: BerHPdfFillFunction = ({
  userData,
  pdfValues,
}) => {
  let attachment: AttachmentEntries = [];
  const { kraftfahrzeuge } = userData;
  pdfValues.f9Kraftfahrzeug1.value = userData.hasKraftfahrzeug === "no";
  pdfValues.f9Kraftfahrzeuge2.value = userData.hasKraftfahrzeug === "yes";

  if (!kraftfahrzeuge || kraftfahrzeuge.length === 0) return { pdfValues };

  const singleKraftfahrzeug = kraftfahrzeuge[0];
  const singleKraftfahrzeugString =
    fillSingleKraftfahrzeug(singleKraftfahrzeug);

  if (
    kraftfahrzeuge.length == 1 &&
    singleKraftfahrzeugString.length < KRAFTFAHRZEUG_ART_FIELD_MAX_CHARS
  ) {
    pdfValues.f10KraftfahrzeugeA.value =
      singleKraftfahrzeug.eigentuemer == "myself";
    pdfValues.f10KraftfahrzeugB.value =
      singleKraftfahrzeug.eigentuemer == "partner";
    pdfValues.f10KraftfahrzeugC.value =
      singleKraftfahrzeug.eigentuemer == "myselfAndPartner";

    pdfValues.f11Fahrzeugart.value = singleKraftfahrzeugString;

    const singleKfzWert = singleKraftfahrzeug.wert
      ? verkaufswertMappingDescription[singleKraftfahrzeug.wert]
      : "";

    pdfValues.f12Verkehrswert.value = singleKraftfahrzeug.verkaufswert
      ? singleKraftfahrzeug.verkaufswert + " €"
      : singleKfzWert;
  } else {
    pdfValues.f11Fahrzeugart.value = newPageHint;
    ({ attachment } = attachKraftfahrzeugeToAnhang(attachment, kraftfahrzeuge));
  }
  return { pdfValues, attachment };
};
