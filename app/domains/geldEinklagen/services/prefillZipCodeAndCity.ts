import { updateSession } from "~/services/session.server";
import { shouldVisitGerichtSuchenPostleitzahlKlagendePerson } from "../formular/gericht-pruefen/gericht-suchen/guards";
import { type GeldEinklagenFormularUserData } from "../formular/userData";
import merge from "lodash/merge";
import { type Session } from "react-router";
import { getCityNameByZipCode } from "~/services/streetNames";

const prefillZipCodeAndCityKlagendePerson = (
  userData: GeldEinklagenFormularUserData,
): Partial<GeldEinklagenFormularUserData> | undefined => {
  //if the user has a secondary zip code and the guard for pre-filling the zip code and city for the plaintiff
  if (
    shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context: userData }) &&
    userData.postleitzahlSecondary
  ) {
    return {
      klagendePersonStatePrefilled: "prefilled",
      klagendePersonPlz: userData.postleitzahlSecondary,
      klagendePersonOrt:
        userData.postleitzahlSecondary === userData.klagendePersonPlz
          ? userData.klagendePersonOrt
          : getCityNameByZipCode(userData.postleitzahlSecondary),
    };
  }

  //if the user has already filled the zip code for the plaintiff, we don't want to overwrite it with an empty value
  if (userData.klagendePersonStatePrefilled === "filledByUser") {
    return undefined;
  }

  /**
   * if the user doesn't have a secondary zip code or the guard for pre-filling the zip code for the plaintiff is not fulfilled
   * we set the state to "unfilled" and empty value for the zip code and city
   *  */
  return {
    klagendePersonStatePrefilled: "unfilled",
    klagendePersonPlz: "",
    klagendePersonOrt: "",
  };
};

const prefillZipCodeAndCityBeklagteData = (
  userData: GeldEinklagenFormularUserData,
): Partial<GeldEinklagenFormularUserData> | undefined => {
  //if the user has the zip code for the defendant
  if (userData.postleitzahlBeklagtePerson) {
    return {
      beklagteStatePrefilled: "prefilled",
      beklagtePlz: userData.postleitzahlBeklagtePerson,
      beklagteOrt:
        userData.postleitzahlBeklagtePerson === userData.beklagtePlz
          ? userData.beklagteOrt
          : getCityNameByZipCode(userData.postleitzahlBeklagtePerson),
    };
  }

  //if the user has already filled the zip code for the defendant, we don't want to overwrite it with an empty value
  if (userData.beklagteStatePrefilled === "filledByUser") {
    return undefined;
  }

  // if the user doesn't have a defendant zip code, we set the state to "unfilled" and empty value for the zip code and city
  return {
    beklagteStatePrefilled: "unfilled",
    beklagtePlz: "",
    beklagteOrt: "",
  };
};

export const prefillZipCodeAndCity = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  const userPrefillData = {
    ...prefillZipCodeAndCityKlagendePerson(userData),
    ...prefillZipCodeAndCityBeklagteData(userData),
  };

  const updatedUserData = merge({}, userData, userPrefillData);

  updateSession(flowSession, updatedUserData);
};

export const updateIfUserNotPrefilledBeklagtePlz = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  if (userData.beklagteStatePrefilled === "prefilled") {
    return;
  }

  const userPrefillData: Partial<GeldEinklagenFormularUserData> = {
    beklagteStatePrefilled: "filledByUser",
  };

  const updatedUserData = merge({}, userData, userPrefillData);

  updateSession(flowSession, updatedUserData);
};

export const updateIfUserNotPrefilledKlagendePersonPlz = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  if (userData.klagendePersonStatePrefilled === "prefilled") {
    return;
  }

  const userPrefillData: Partial<GeldEinklagenFormularUserData> = {
    klagendePersonStatePrefilled: "filledByUser",
  };

  const updatedUserData = merge({}, userData, userPrefillData);

  updateSession(flowSession, updatedUserData);
};
