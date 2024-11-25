import { getStringWithSpaceIfStringExists } from "./getStringWithSpaceIfStringExists";
import { type FluggastrechtContext } from "../../formular/context";

export const getPersonData = (userData: FluggastrechtContext) => {
  return {
    klagendePerson: `${getStringWithSpaceIfStringExists(userData.anrede) + getStringWithSpaceIfStringExists(userData.vorname) + getStringWithSpaceIfStringExists(userData.nachname)}`,
    strasseHausnummer: userData.strasseHausnummer,
    plzOrt: `${userData.plz} ${userData.ort}`,
    telefonnummer: userData.telefonnummer,
    kontodaten: userData.iban
      ? `${userData.iban} \n ${userData.kontoinhaber}`
      : "",
  };
};

export const getFlugDaten = (userData: FluggastrechtContext) => {
  return {
    flugnummer: userData.direktFlugnummer,
    buchungsnummer: userData.buchungsNummer,
    abflug: `${userData.direktAbflugsDatum} - ${userData.direktAbflugsZeit}`,
    ankunft: `${userData.direktAnkunftsDatum} - ${userData.direktAnkunftsZeit}`,
    zwischenstops: userData.zwischenstoppAnzahl,
  };
};

export const getZeugenText = (userData: FluggastrechtContext) => {
  if (userData.hasZeugen === "no") return "noWitnesses";
  if (userData.isWeiterePersonen) return "cedentsAndWitnesses";
  return "noCedentsAndWitnesses";
};
