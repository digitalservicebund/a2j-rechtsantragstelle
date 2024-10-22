import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import type { BerHPdfFillFunction } from "../..";
import {
  attachGeldanlagenToAnhang,
  eigentuemerMapping,
  fillSingleGeldanlage,
  fillSingleWertsache,
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
    pdfValues.f15Bezeichnung.value = SEE_IN_ATTACHMENT_DESCRIPTION;
    const { attachment } = attachGeldanlagenToAnhang(geldanlagen);
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
    return { pdfValues, attachment };
  }
  return { pdfValues };
};
