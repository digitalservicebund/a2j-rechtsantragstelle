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
    Flugnummer: userData.direktFlugnummer,
    Buchungsnummer: userData.buchungsNummer,
    Abflug: `${userData.direktAbflugsDatum} - ${userData.direktAbflugsZeit}`,
    Ankunft: `${userData.direktAnkunftsDatum} - ${userData.direktAnkunftsZeit}`,
    Zwischenstops: userData.zwischenstoppAnzahl,
  };
};

export const getZeugenText = (userData: FluggastrechtContext) => {
  if (userData.hasZeugen === "no") return "noWitnesses";
  if (userData.isWeiterePersonen) return "cedentsAndWitnesses";
  return "noCedentsAndWitnesses";
};
