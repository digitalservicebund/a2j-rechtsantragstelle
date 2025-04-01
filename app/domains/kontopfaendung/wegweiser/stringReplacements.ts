import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type KontopfaendungWegweiserContext } from "./context";

export const getWegweiserStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasPKonto: userData.hasPKonto?.includes(userData.hasPKonto),

    isPrivilegierteForderungStrafe: userData.unerlaubtenHandlung === "yes",
    isPrivilegierteForderungUnterhalt: userData.unterhaltszahlungen === "yes",

    hasErhoehungsbetrag: userData.kinderLebtMit?.includes(
      userData.kinderLebtMit,
    ),

    hasKindergeld:
      userData.sozialleistungenUmstaende?.kindergeld === CheckboxValue.on,
    hasEinmalSozialleistung:
      userData.hasSozialleistungenEinmalzahlung === "yes",
    hasNachzahlungSozialUnter500: userData.socialAmountHigher500 === "no",
    hasNachzahlungSozialMehr500: userData.socialAmountHigher500 === "yes",
    hasNachzahlungArbeitUnter500: userData.nachzahlungArbeitgeber === "no",
    hasNachzahlungArbeitMehr500: userData.nachzahlungArbeitgeber === "yes",
    hasBuergergeld: userData.hasSozialleistungen === "buergergeld",
    hasGrundsicherung:
      userData.hasSozialleistungen === "grundsicherungSozialhilfe",
    hasAsylbewerberleistung:
      userData.hasSozialleistungen === "asylbewerberleistungen",
    hasPflegegeldSelbst: userData.pflegegeld === "selbst",
    hasPflegegeldFremd: userData.pflegegeld === "fremd",

    hasBehordenschulden: userData.schuldenBei?.includes(userData.schuldenBei),
    hasArbeitsentgeltEinmalig: Object.values(
      userData.zahlungArbeitgeber ?? {},
    ).includes(CheckboxValue.on),

    isSelbststaendig: userData.arbeitsweise?.selbstaendig === CheckboxValue.on,
    hasWohngeld:
      userData.sozialleistungenUmstaende?.wohngeld === CheckboxValue.on,
    isAngestellt: userData.arbeitsweise?.angestellt === CheckboxValue.on,
    hasKinder: userData.hasKinder === "yes",
  };
};
