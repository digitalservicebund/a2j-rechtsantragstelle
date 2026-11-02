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

export const getKanzleiStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const arrayIndex = firstArrayIndex(context.pageData);
  if (arrayIndex === undefined) return {};
  const kanzlei = context.klagendeProzessbevollmaechtigte?.at(arrayIndex);
  const beklagteKanzlei =
    context.beklagteProzessbevollmaechtigte?.at(arrayIndex);
  if (!kanzlei && !beklagteKanzlei) return {};
  return {
    klagendeKanzleiName: kanzlei?.name ?? "",
    beklagteKanzleiName: beklagteKanzlei?.name ?? "",
  };
};

// TODO: Fix when Antrag entry is working and all prerequesites live in UserData
export const getAntraegeStrings = (
  _context: GeldEinklagenAnwaltschaftUserData,
) => {
  return { keineAntraege: false };
  // if (!context.hauptantrag && !context.sonstigeNebenUndProzessantraege)
  //   return {
  //     keineAntraege: true,
  //   };
  // return {
  //   keineAntraege:
  //     context.hauptantrag?.length === 0 &&
  //     context.sonstigeNebenUndProzessantraege?.length === 0,
  // };
};
