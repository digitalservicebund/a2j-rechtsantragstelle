import { getOrderedAntraege } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
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

export const getAntraegeStrings = (
  context: GeldEinklagenAnwaltschaftUserData,
) => {
  const antraege = getOrderedAntraege(context);
  const [vortragIndex, absatzIndex] = context.pageData?.arrayIndexes ?? [];
  if (vortragIndex === undefined) {
    return { keineAntraege: antraege.length === 0 };
  }
  const antragId = context.vortraege?.at(vortragIndex)?.antragId;
  const antrag = antraege.find((item) => item.antragId === antragId);
  return {
    keineAntraege: antraege.length === 0,
    antragTitle: antrag?.title ?? "",
    isNebenantrag: antrag?.isNebenantrag ?? false,
    ...(absatzIndex !== undefined && { absatzNumber: `${absatzIndex + 1}` }),
  };
};
