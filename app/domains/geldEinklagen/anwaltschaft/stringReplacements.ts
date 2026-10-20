import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { firstArrayIndex } from "~/services/flow/pageData";

export const getKlagendeStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const klagende = context.klagenden?.at(arrayIndex);
  if (!klagende) return {};
  return {
    klagendeAnrede: "anrede" in klagende ? klagende.anrede : "",
    klagendeTitel: "titel" in klagende ? klagende.titel : "",
    klagendeVorname: "vorname" in klagende ? klagende.vorname : "",
    klagendeNachname: "nachname" in klagende ? klagende.nachname : "",
  };
};

export const getOrganisationStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const organisation = context.klagenden?.at(arrayIndex);
  if (!organisation) return {};
  return {
    organisationName: "orgName" in organisation ? organisation.orgName : "",
  };
};
