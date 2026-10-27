import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getFullPlaintiffName } from "~/domains/shared/services/pdf/getFullPlaintiffName";
import { firstArrayIndex } from "~/services/flow/pageData";

export const getKlagendeStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const klagende = context.klagenden?.at(arrayIndex);
  if (!klagende) return {};
  return {
    fullKlagendeName:
      "vorname" in klagende
        ? getFullPlaintiffName(
            klagende.anrede,
            klagende.titel,
            klagende.vorname,
            klagende.nachname,
          )
        : "",
    organisationName: "orgName" in klagende ? klagende.orgName : "",
  };
};

export const getBeklagteStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const beklagte = context.beklagten?.at(arrayIndex);
  if (!beklagte) return {};
  return {
    fullBeklagteName:
      "vorname" in beklagte
        ? getFullPlaintiffName(
            beklagte.anrede,
            beklagte.titel,
            beklagte.vorname,
            beklagte.nachname,
          )
        : "",
    beklagteOrganisationName: "orgName" in beklagte ? beklagte.orgName : "",
  };
};
