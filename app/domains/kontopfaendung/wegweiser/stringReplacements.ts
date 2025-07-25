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
      userData.kinderWohnenZusammen === "teilweise" ||
      userData.partnerUnterhalt === "yes" ||
      userData.partnerWohnenZusammen === "yes",
  };
};
export const getKindergeldStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasKindergeld: userData.hasKindergeld === "yes",
  };
};
export const getWohngeldStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasWohngeld: userData.hasWohngeld === "yes",
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
      userData.hasSozialleistungNachzahlung === "yes" ||
      userData.hasWohngeldNachzahlung === "yes" ||
      userData.hasKindergeldNachzahlung === "yes",
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
export const getPflegegeldStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasPflegegeld: userData.hasPflegegeld === "yes",
  };
};
export const getArbeitsentgeltEinmaligStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  return {
    hasArbeitsentgeltEinmalig:
      typeof userData.zahlungArbeitgeber !== "undefined" &&
      userData.zahlungArbeitgeber !== null &&
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
export const getRenteStrings = (userData: KontopfaendungWegweiserUserData) => {
  return {
    hasRente: userData.hasRente === "yes",
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

  const schuldnerberatungsstelleIsVisible =
    hasErhoehungsbetrag ||
    hasKindergeld ||
    hasEinmalSozialleistung ||
    hasNachzahlungSozialUnter500 ||
    hasNachzahlungArbeitUnter500 ||
    hasBuergergeld ||
    hasGrundsicherung ||
    hasAsylbewerberleistung;
  return { schuldnerberatungsstelleIsVisible };
};
export const getAmtsgerichtStrings = (
  userData: KontopfaendungWegweiserUserData,
) => {
  const hasArbeitsentgeltEinmalig =
    getArbeitsentgeltEinmaligStrings(userData).hasArbeitsentgeltEinmalig;
  const hasNachzahlungArbeitMehr500 =
    getNachzahlungArbeitMehr500Strings(userData).hasNachzahlungArbeitMehr500;
  const hasNachzahlungSozialMehr500 =
    getNachzahlungSozialMehr500Strings(userData).hasNachzahlungSozialMehr500;
  const { isSelbststaendig } = getSelbststaendigStrings(userData);
  const { hasWohngeld } = getWohngeldStrings(userData);
  const amtsgerichtIsVisible =
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
export const getHasErhöhungStrings = (
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
  const { isSelbststaendig } = getSelbststaendigStrings(userData);
  const { hasAsylbewerberleistung } = getAsylbewerberleistungStrings(userData);
  const hasArbeitsentgeltEinmalig =
    getArbeitsentgeltEinmaligStrings(userData).hasArbeitsentgeltEinmalig;
  const hasNachzahlungArbeitMehr500 =
    getNachzahlungArbeitMehr500Strings(userData).hasNachzahlungArbeitMehr500;
  const hasNachzahlungSozialMehr500 =
    getNachzahlungSozialMehr500Strings(userData).hasNachzahlungSozialMehr500;
  const hasWohngeld = getWohngeldStrings(userData).hasWohngeld;

  return {
    hasErhöhung:
      hasErhoehungsbetrag ||
      hasKindergeld ||
      hasEinmalSozialleistung ||
      hasNachzahlungSozialUnter500 ||
      hasNachzahlungArbeitUnter500 ||
      hasBuergergeld ||
      hasGrundsicherung ||
      hasAsylbewerberleistung ||
      hasArbeitsentgeltEinmalig ||
      hasNachzahlungArbeitMehr500 ||
      hasNachzahlungSozialMehr500 ||
      isSelbststaendig ||
      hasWohngeld,
  };
};
