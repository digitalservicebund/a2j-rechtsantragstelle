import { type KontopfaendungWegweiserUserData } from "./userData";

export const getArbeitStrings = (userData: KontopfaendungWegweiserUserData) => {
  return {
    hasArbeit: userData.hasArbeit === "yes",
  };
};
export const getPKontoStrings = (userData: KontopfaendungWegweiserUserData) => {
  return {
    hasPKonto: userData.hasPKonto === "ja",
    hasNoPKonto: userData.hasPKonto === "nein",
    hasPKontoBank: userData.hasPKonto === "nichtEingerichtet",
    hasPKontoNichtAktive: userData.hasPKonto === "nichtAktiv",
  };
};
export const getPrivilegierteForderungStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    isPrivilegierteForderungStrafe: userData.pfaendungStrafe === "yes",
    isPrivilegierteForderungUnterhalt: userData.pfaendungUnterhalt === "yes",
  };
};
export const getErhoehungsbetragStrings = (
  userData: KontopfaendungWegweiserUserData,
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
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasKindergeld: userData.sozialleistungenUmstaende?.kindergeld === "on",
  };
};
export const getWohngeldStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasWohngeld: userData.sozialleistungenUmstaende?.wohngeld === "on",
  };
};
export const getEinmalSozialleistungStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasEinmalSozialleistung:
      userData.hasSozialleistungenEinmalzahlung === "yes",
  };
};
export const getNachzahlungSozialUnter500Strings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasNachzahlungSozialUnter500:
      userData.hasSozialleistungNachzahlung === "yes" &&
      userData.sozialleistungNachzahlungHigherThan === "no",
  };
};
export const getNachzahlungSozialMehr500Strings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasNachzahlungSozialMehr500:
      userData.hasSozialleistungNachzahlung === "yes" &&
      userData.sozialleistungNachzahlungHigherThan === "yes",
  };
};
export const getNachzahlungArbeitUnter500Strings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasNachzahlungArbeitUnter500:
      userData.nachzahlungArbeitgeber === "yes" &&
      userData.arbeitgeberNachzahlungHigherThan === "no",
  };
};
export const getNachzahlungArbeitMehr500Strings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasNachzahlungArbeitMehr500:
      userData.nachzahlungArbeitgeber === "yes" &&
      userData.arbeitgeberNachzahlungHigherThan === "yes",
  };
};
export const getBuergergeldStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasBuergergeld: userData.hasSozialleistungen === "buergergeld",
  };
};
export const getGrundsicherungStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasGrundsicherung:
      userData.hasSozialleistungen === "grundsicherungSozialhilfe",
  };
};
export const getAsylbewerberleistungStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasAsylbewerberleistung:
      userData.hasSozialleistungen === "asylbewerberleistungen",
  };
};
export const getPflegegeldSelbstStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasPflegegeldSelbst: userData.pflegegeld === "selbst",
  };
};
export const getPflegegeldFremdStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasPflegegeldFremd: userData.pflegegeld === "fremd",
  };
};
export const getBehordenschuldenStrings = (
  userData: KontopfaendungWegweiserUserData,
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
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasArbeitsentgeltEinmalig:
      typeof userData.zahlungArbeitgeber !== "undefined" &&
      Object.values(userData.zahlungArbeitgeber).some(
        (value) => value === "on",
      ),
  };
};
export const getSelbststaendigStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    isSelbststaendig: userData.arbeitArt?.selbstaendig === "on",
  };
};
export const getAngestelltStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    isAngestellt: userData.arbeitArt?.angestellt === "on",
  };
};
export const getKinderStrings = (userData: KontopfaendungWegweiserUserData) => {
  return {
    hasKinder: userData.hasKinder === "yes",
  };
};
export const getSchuldnerberatungsstelleStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  const { hasErhoehungsbetrag } = getErhoehungsbetragStrings(userData);
  const { hasKindergeld } = getKindergeldStrings(userData);
  const { hasEinmalSozialleistung } = getEinmalSozialleistungStrings(userData);
  const { hasNachzahlungSozialUnter500 } =
    getNachzahlungSozialUnter500Strings(userData);
  const { hasNachzahlungArbeitUnter500 } =
    getNachzahlungArbeitUnter500Strings(userData);
  const { hasBuergergeld } = getBuergergeldStrings(userData);
  const { hasGrundsicherung } = getGrundsicherungStrings(userData);
  const { hasAsylbewerberleistung } = getAsylbewerberleistungStrings(userData);
  const hasPflegegeldSelbst =
    getPflegegeldSelbstStrings(userData).hasPflegegeldSelbst;
  const schuldnerberatungsstelleIsVisible =
    hasErhoehungsbetrag ||
    hasKindergeld ||
    hasEinmalSozialleistung ||
    hasNachzahlungSozialUnter500 ||
    hasNachzahlungArbeitUnter500 ||
    hasBuergergeld ||
    hasGrundsicherung ||
    hasAsylbewerberleistung ||
    hasPflegegeldSelbst;
  return { schuldnerberatungsstelleIsVisible };
};
export const getAmtsgerichtStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  const { hasPflegegeldFremd } = getPflegegeldFremdStrings(userData);
  const hasArbeitsentgeltEinmalig =
    getArbeitsentgeltEinmaligStrings(userData).hasArbeitsentgeltEinmalig;
  const hasNachzahlungArbeitMehr500 =
    getNachzahlungArbeitMehr500Strings(userData).hasNachzahlungArbeitMehr500;
  const hasNachzahlungSozialMehr500 =
    getNachzahlungSozialMehr500Strings(userData).hasNachzahlungSozialMehr500;
  const { isSelbststaendig } = getSelbststaendigStrings(userData);
  const { hasWohngeld } = getWohngeldStrings(userData);
  const amtsgerichtIsVisible =
    hasPflegegeldFremd ||
    hasArbeitsentgeltEinmalig ||
    hasNachzahlungArbeitMehr500 ||
    hasNachzahlungSozialMehr500 ||
    isSelbststaendig ||
    hasWohngeld;
  return { amtsgerichtIsVisible };
};
export const getInfoZumPKontoStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  const { hasNoPKonto, hasPKontoNichtAktive, hasPKontoBank } =
    getPKontoStrings(userData);
  const { isPrivilegierteForderungStrafe, isPrivilegierteForderungUnterhalt } =
    getPrivilegierteForderungStrings(userData);
  const infoZumPKontoIsVisible =
    hasNoPKonto ||
    hasPKontoBank ||
    hasPKontoNichtAktive ||
    isPrivilegierteForderungStrafe ||
    isPrivilegierteForderungUnterhalt;
  return { infoZumPKontoIsVisible };
};
