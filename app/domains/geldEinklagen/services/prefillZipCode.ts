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
      klagendePersonStatePlzPrefilled: "prefilled",
      klagendePersonPlz: userData.postleitzahlSecondary,
    };
  }

  //if the user has already filled the zip code for the plaintiff, we don't want to overwrite it with an empty value
  if (userData.klagendePersonStatePlzPrefilled === "filledByUser") {
    return undefined;
  }

  /**
   * if the user doesn't have a secondary zip code or the guard for pre-filling the zip code for the plaintiff is not fulfilled
   * we set the state to "none" and the zip code to an empty value
   *  */
  return {
    klagendePersonStatePlzPrefilled: "none",
    klagendePersonPlz: "",
  };
};

const prefillZipBeklagtePerson = (
  userData: GeldEinklagenFormularUserData,
): Partial<GeldEinklagenFormularUserData> | undefined => {
  //if the user has the zip code for the defendant
  if (userData.postleitzahlBeklagtePerson) {
    return {
      beklagteStatePlzPrefilled: "prefilled",
      beklagtePlz: userData.postleitzahlBeklagtePerson,
    };
  }

  //if the user has already filled the zip code for the defendant, we don't want to overwrite it with an empty value
  if (userData.beklagteStatePlzPrefilled === "filledByUser") {
    return undefined;
  }

  // if the user doesn't have a defendant zip code, we set the state to "none" and the zip code to an empty value
  return {
    beklagteStatePlzPrefilled: "none",
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
  if (userData.beklagteStatePlzPrefilled === "prefilled") {
    return;
  }

  const userPrefillData: Partial<GeldEinklagenFormularUserData> = {
    beklagteStatePlzPrefilled: "filledByUser",
  };

  const updatedUserData = merge({}, userData, userPrefillData);

  updateSession(flowSession, updatedUserData);
};

export const updateIfUserNotPrefilledKlagendePersonPlz = async (
  _request: Request,
  userData: GeldEinklagenFormularUserData,
  flowSession: Session,
) => {
  if (userData.klagendePersonStatePlzPrefilled === "prefilled") {
    return;
  }

  const userPrefillData: Partial<GeldEinklagenFormularUserData> = {
    klagendePersonStatePlzPrefilled: "filledByUser",
  };

  const updatedUserData = merge({}, userData, userPrefillData);

  updateSession(flowSession, updatedUserData);
};
