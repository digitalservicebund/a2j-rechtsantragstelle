import { updateSession } from "~/services/session.server";
import { shouldVisitGerichtSuchenPostleitzahlKlagendePerson } from "../formular/gericht-pruefen/gericht-suchen/guards";
import { type GeldEinklagenFormularUserData } from "../formular/userData";
import merge from "lodash/merge";
import { type Session } from "react-router";

const prefillZipKlagendePerson = (
  userData: GeldEinklagenFormularUserData,
): Partial<GeldEinklagenFormularUserData> | undefined => {
  //if the user has a secondary zip code and the guard for pre-filling the zip code for the plaintiff
  if (
    shouldVisitGerichtSuchenPostleitzahlKlagendePerson({ context: userData }) &&
    userData.postleitzahlSecondary
  ) {
    return {
      klagendePersonStatePrefilled: "prefilled",
      klagendePersonPlz: userData.postleitzahlSecondary,
    };
  }

  //if the user has already filled the zip code for the plaintiff, we don't want to overwrite it with an empty value
  if (userData.klagendePersonStatePrefilled === "filledByUser") {
    return undefined;
  }

  /**
   * if the user doesn't have a secondary zip code or the guard for pre-filling the zip code for the plaintiff is not fulfilled
   * we set the state to "unfilled" and the zip code to an empty value
   *  */
  return {
    klagendePersonStatePrefilled: "unfilled",
    klagendePersonPlz: "",
  };
};

const prefillZipBeklagtePerson = (
  userData: GeldEinklagenFormularUserData,
): Partial<GeldEinklagenFormularUserData> | undefined => {
  //if the user has the zip code for the defendant
  if (userData.postleitzahlBeklagtePerson) {
    return {
      beklagteStatePrefilled: "prefilled",
      beklagtePlz: userData.postleitzahlBeklagtePerson,
    };
  }

  //if the user has already filled the zip code for the defendant, we don't want to overwrite it with an empty value
  if (userData.beklagteStatePrefilled === "filledByUser") {
    return undefined;
  }

  // if the user doesn't have a defendant zip code, we set the state to "unfilled" and the zip code to an empty value
  return {
    beklagteStatePrefilled: "unfilled",
    beklagtePlz: "",
  };
};

export const prefillZipCode = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  const userPrefillData = {
    ...prefillZipKlagendePerson(userData),
    ...prefillZipBeklagtePerson(userData),
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
