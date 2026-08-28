import type z from "zod";
import { type AsyncFlowAction } from "~/domains/flows.server";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import {
  type ElternteilKind,
  type Kind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import { type NachlassRelationshipType } from "~/domains/nachlass/shared/schemas";
import { updateSession } from "~/services/session.server";
import { type YesNoAnswer } from "~/services/validation/YesNoAnswer";

type AntragstellendePerson = {
  vorname: string;
  nachname: string;
  geburtsname?: string;
  geburtsdatum: {
    day: string;
    month: string;
    year: string;
  };
  isAlive: "yes";
  geburtsort: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  staatsangehoerigkeit?: string;
  hadSecondNationality?: z.infer<typeof YesNoAnswer>;
  secondNationality?: string;
  adresszusatz?: string;
  verhaeltnis: NachlassRelationshipType;
};

function antragstellendePersonToEhepartner(
  antragstellendePerson: AntragstellendePerson,
): Partial<NachlassErbscheinAnfrageUserData> {
  return {
    ehepartnerVorname: antragstellendePerson.vorname,
    ehepartnerNachname: antragstellendePerson.nachname,
    ehepartnerGeburtsname: antragstellendePerson.geburtsname,
    ehepartnerStrasse: antragstellendePerson.strasse,
    ehepartnerHausnummer: antragstellendePerson.hausnummer,
    ehepartnerPlz: antragstellendePerson.plz,
    ehepartnerOrt: antragstellendePerson.ort,
    ehepartnerAdresszusatz: antragstellendePerson.adresszusatz,
    ehepartnerStaatsangehoerigkeit: antragstellendePerson.staatsangehoerigkeit,
    ehepartnerHadSecondNationality: antragstellendePerson.hadSecondNationality,
    ehepartnerZweiteStaatsangehoerigkeit:
      antragstellendePerson.secondNationality,
  };
}

function antragstellendePersonToDescendant(
  antragstellendePerson: AntragstellendePerson,
  secondGeneration: boolean = false,
): Kind | ElternteilKind {
  return {
    vorname: "",
    nachname: "",
    geburtsdatum: {
      day: "",
      month: "",
      year: "",
    },
    geburtsort: "",
    isAlive: "no",
    sterbedatum: {
      day: "",
      month: "",
      year: "",
    },
    sterbeort: "",
    hatteKinder: "yes",
    kinder: [
      secondGeneration
        ? antragstellendePersonToDescendant(antragstellendePerson)
        : antragstellendePerson,
    ],
  };
}

/**
 * Function needed to determine where to place the antragstellende person in the angehoerige section
 */
function convertAntragstellendePersonToAngehoerige(
  antragstellendePerson: AntragstellendePerson,
): Partial<NachlassErbscheinAnfrageUserData> {
  const relationshipToErblasser = antragstellendePerson.verhaeltnis;
  switch (relationshipToErblasser) {
    case "wife-husband":
      return antragstellendePersonToEhepartner(antragstellendePerson);
    case "daughter-son":
    case "adoptive-daughter-adoptive-son":
      return {
        kinder: [antragstellendePerson],
      };
    case "granddaughter-grandson":
      return {
        kinder: [antragstellendePersonToDescendant(antragstellendePerson)],
      };
    case "mother-father":
    case "adoptive-mother-adoptive-father":
      return {
        elternteile: [antragstellendePerson],
      };
    case "sister-brother":
    case "half-sister-half-brother":
      return {
        elternteile: [antragstellendePersonToDescendant(antragstellendePerson)],
      };
    case "niece-nephew":
      return {
        elternteile: [
          antragstellendePersonToDescendant(antragstellendePerson, true),
        ],
      };
    default:
      return {
        angehoerige: [antragstellendePerson],
      };
  }
}

/**
 * The Antragstellende Person is more than likely not Erbberechtigt,
 * so we should copy their data to the Testament/Angehörige section as
 * an array item, to reduce the redundant data entry for the user.
 */
export const copyAntragstellendePersonData: AsyncFlowAction<
  NachlassErbscheinAnfrageUserData
> = async (_request, userData, flowSession) => {
  const antragstellendePerson: AntragstellendePerson = {
    vorname: userData.antragstellendePersonVorname ?? "",
    nachname: userData.antragstellendePersonNachname ?? "",
    geburtsname: userData.antragstellendePersonGeburtsname,
    verhaeltnis:
      userData.antragstellendePersonRelationshipToErblasser ?? "other",
    geburtsdatum: userData.antragstellendePersonGeburtsdatum ?? {
      day: "",
      month: "",
      year: "",
    },
    geburtsort: userData.antragstellendePersonGeburtsort ?? "",
    isAlive: "yes",
    strasse: userData.antragstellendePersonStrasse ?? "",
    hausnummer: userData.antragstellendePersonHausnummer ?? "",
    plz: userData.antragstellendePersonPlz ?? "",
    ort: userData.antragstellendePersonOrt ?? "",
    land: userData.antragstellendePersonLand ?? "",
    staatsangehoerigkeit: userData.antragstellendePersonStaatsangehoerigkeit,
    hadSecondNationality: userData.antragstellendePersonHasSecondNationality,
    secondNationality: userData.antragstellendePersonZweiteStaatsangehoerigkeit,
    adresszusatz: userData.antragstellendePersonAdresszusatz,
  };
  updateSession(flowSession, {
    beguenstigten: [antragstellendePerson],
    ...convertAntragstellendePersonToAngehoerige(antragstellendePerson),
  });
};
