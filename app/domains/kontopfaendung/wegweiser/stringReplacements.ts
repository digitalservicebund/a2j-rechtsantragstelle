import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type KontopfaendungWegweiserContext } from "./context";

export const getArbeitStrings = (userData: KontopfaendungWegweiserContext) => {
  return {
    hasArbeit: userData.hasArbeit === "yes",
  };
};
export const getPKontoStrings = (userData: KontopfaendungWegweiserContext) => {
  return {
    hasPKonto: userData.hasPKonto === "ja",
    hasNoPKonto: userData.hasPKonto === "nein",
    hasPKontoBank: userData.hasPKonto === "nichtEingerichtet",
    hasPKontoNichtAktive: userData.hasPKonto === "nichtAktiv",
  };
};
export const getPrivilegierteForderungStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    isPrivilegierteForderungStrafe: userData.pfaendungStrafe === "yes",
    isPrivilegierteForderungUnterhalt: userData.pfaendungUnterhalt === "yes",
  };
};
export const getErhoehungsbetragStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasErhoehungsbetrag:
      userData.kinderUnterhalt === "yes" ||
      userData.kinderWohnenZusammen === "ja" ||
      userData.partnerUnterhalt === "yes" ||
      userData.partnerWohnenZusammen === "yes",
  };
};
export const getKindergeldStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasKindergeld:
      userData.sozialleistungenUmstaende?.kindergeld === CheckboxValue.on,
  };
};
export const getWohngeldStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasWohngeld:
      userData.sozialleistungenUmstaende?.wohngeld === CheckboxValue.on,
  };
};
export const getEinmalSozialleistungStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasEinmalSozialleistung:
      userData.hasSozialleistungenEinmalzahlung === "yes",
  };
};
export const getNachzahlungSozialUnter500Strings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasNachzahlungSozialUnter500:
      userData.sozialleistungNachzahlungHigherThan === "no",
  };
};
export const getNachzahlungSozialMehr500Strings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasNachzahlungSozialMehr500:
      userData.sozialleistungNachzahlungHigherThan === "yes",
  };
};
export const getNachzahlungArbeitUnter500Strings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasNachzahlungArbeitUnter500:
      userData.arbeitgeberNachzahlungHigherThan === "no",
  };
};
export const getNachzahlungArbeitMehr500Strings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasNachzahlungArbeitMehr500:
      userData.arbeitgeberNachzahlungHigherThan === "yes",
  };
};
export const getBuergergeldStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasBuergergeld: userData.hasSozialleistungen === "buergergeld",
  };
};
export const getGrundsicherungStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasGrundsicherung:
      userData.hasSozialleistungen === "grundsicherungSozialhilfe",
  };
};
export const getAsylbewerberleistungStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasAsylbewerberleistung:
      userData.hasSozialleistungen === "asylbewerberleistungen",
  };
};
export const getPflegegeldSelbstStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasPflegegeldSelbst: userData.pflegegeld === "selbst",
  };
};
export const getPflegegeldFremdStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasPflegegeldFremd: userData.pflegegeld === "fremd",
  };
};
export const getBehordenschuldenStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasBehordenschuldenPrivat: userData.schuldenBei === "privat",
    hasBehordenschuldenBehoerden: userData.schuldenBei === "behoerden",
    hasBehordenschuldenKredit: userData.schuldenBei === "kredit",
    hasBehordenschuldenKrankenkasse: userData.schuldenBei === "krankenkasse",
    hasBehordenschuldenRechnung: userData.schuldenBei === "rechnung",
    hasBehordenschuldenBeitragsservice:
      userData.schuldenBei === "beitragsservice",
    hasBehordenschuldenFinanzamt: userData.schuldenBei === "finanzamt",
    hasBehordenschuldenHauptzollamt: userData.schuldenBei === "hauptzollamt",
    hasBehordenschuldenNichtSagen: userData.schuldenBei === "nichtSagen",
    hasBehordenschuldenWeissNicht: userData.schuldenBei === "weissNicht",
    hasBehordenschuldenStaatsanwaltschaft:
      userData.schuldenBei === "staatsanwaltschaft",
    hasBehordenschuldenKasse: userData.schuldenBei === "kasse",
    hasBehordenschuldenJugendamt: userData.schuldenBei === "jugendamt",
  };
};
export const getArbeitsentgeltEinmaligStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    hasArbeitsentgeltEinmalig:
      typeof userData.zahlungArbeitgeber !== "undefined" &&
      Object.values(userData.zahlungArbeitgeber).some(
        (value) => value === CheckboxValue.on,
      ),
  };
};
export const getSelbststaendigStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    isSelbststaendig: userData.arbeitArt?.selbstaendig === CheckboxValue.on,
  };
};
export const getAngestelltStrings = (
  userData: KontopfaendungWegweiserContext,
) => {
  return {
    isAngestellt: userData.arbeitArt?.angestellt === CheckboxValue.on,
  };
};
export const getKinderStrings = (userData: KontopfaendungWegweiserContext) => {
  return {
    hasKinder: userData.hasKinder === "yes",
  };
};
