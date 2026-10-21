import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { firstArrayIndex } from "~/services/flow/pageData";

export const getKlagendeStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const klagende = context.klagenden?.at(arrayIndex);
  if (!klagende || !("vorname" in klagende)) return {};
  return {
    fullKlagendeName: getFullPlaintiffName(
      klagende.anrede,
      klagende.titel,
      klagende.vorname,
      klagende.nachname,
    ),
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
