import { uppercaseFirstLetter } from "~/util/strings";
import { getStringWithSpaceIfStringExists } from "./getStringWithSpaceIfStringExists";
import { type FluggastrechtContext } from "../../formular/context";

export const NO_SPECIFICATION = "Keine Angabe";
export const FLOW_ID = "/fluggastrechte/formular";

export const getPersonData = (userData: FluggastrechtContext) => {
  const anrede =
    userData.anrede !== "none" ? uppercaseFirstLetter(userData.anrede) : "";
  const address = `${getStringWithSpaceIfStringExists(anrede) + getStringWithSpaceIfStringExists(userData.title) + getStringWithSpaceIfStringExists(userData.vorname) + getStringWithSpaceIfStringExists(userData.nachname)}\n${userData.strasseHausnummer}\n${userData.plz} ${userData.ort}`;
  return {
    person: address,
    telefonnummer: userData.telefonnummer || NO_SPECIFICATION,
    kontodaten: userData.iban
      ? `${userData.iban} \n ${userData.kontoinhaber}`
      : NO_SPECIFICATION,
  };
};

export const getFlugDaten = (userData: FluggastrechtContext) => {
  return {
    flugnummer: userData.direktFlugnummer,
    buchungsnummer: userData.buchungsNummer,
    abflug: `${userData.direktAbflugsDatum} \n ${userData.direktAbflugsZeit}`,
    ankunft: `${userData.direktAnkunftsDatum} \n ${userData.direktAnkunftsZeit}`,
    zwischenstops: userData.zwischenstoppAnzahl,
  };
};

export const getZeugenText = (userData: FluggastrechtContext) => {
  if (userData.hasZeugen === "no") return "noWitnesses";
  if (userData.isWeiterePersonen === "yes") return "cedentsAndWitnesses";
  return "noCedentsAndWitnesses";
};
