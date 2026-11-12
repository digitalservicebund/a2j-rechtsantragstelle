import {
  getNumberedAntragTitle,
  getOrderedAntraege,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
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

const antragArrayByStepIdPrefix = [
  [
    "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/",
    "hauptantrag",
  ],
  [
    "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/",
    "schmerzengeldantrag",
  ],
  ["/sonstige-antraege/antrag/", "sonstigeAntraege"],
] as const;

/**
 * Antrag placeholders depend on the page: on an Antrag's own pages,
 * antragTitle is the Antrag (or, on Nebenantrag pages, its parent);
 * on Tatsachenvortrag pages it is the Antrag linked to the current Vortrag.
 */
export const getAntraegeStrings = (
  userData: GeldEinklagenAnwaltschaftUserData,
  stepId: string,
  arrayIndexes: number[] = [],
) => {
  const antraege = getOrderedAntraege(userData);
  const keineAntraege = antraege.length === 0;
  const [firstIndex, secondIndex] = arrayIndexes;
  if (firstIndex === undefined) return { keineAntraege };

  if (stepId.startsWith("/tatsachenvortrag-beweise/vortraege/")) {
    const antragId = userData.vortraege?.at(firstIndex)?.antragId;
    const antrag = antraege.find((item) => item.antragId === antragId);
    return {
      keineAntraege,
      antragTitle: antrag?.title ?? "",
      isNebenantrag: antrag?.isNebenantrag ?? false,
      ...(secondIndex !== undefined && {
        absatzNumber: `${secondIndex + 1}`,
      }),
    };
  }

  const arrayName = antragArrayByStepIdPrefix.find(([prefix]) =>
    stepId.startsWith(prefix),
  )?.[1];
  if (!arrayName) return { keineAntraege };
  return {
    keineAntraege,
    antragTitle: getNumberedAntragTitle(userData, arrayName, firstIndex),
  };
};
