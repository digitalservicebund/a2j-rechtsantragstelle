import { getPilotCourts } from "../services/court/getPilotCourts";
import { getResponsibleCourt } from "../services/court/getResponsibleCourt";
import { type GeldEinklagenFormularUserData } from "./userData";

export const isBeklagtePerson = (context: GeldEinklagenFormularUserData) => {
  return { isBeklagtePerson: context.gegenWenBeklagen === "person" };
};

export const hasClaimVertrag = (context: GeldEinklagenFormularUserData) => {
  return {
    hasClaimVertrag:
      context.versicherungVertrag === "yes" ||
      context.klagendeVertrag === "yes" ||
      context.mietePachtVertrag === "yes",
  };
};

export const getOptionsCourts = (context: GeldEinklagenFormularUserData) => {
  const courts = getPilotCourts(context);

  if (courts.length <= 1) {
    return {};
  }

  const [primary, secondary] = courts;

  return {
    beklagteCourtName: primary.BEZEICHNUNG,
    beklagteCourtStreetAndNumber: primary.STR_HNR,
    beklagteCourtZipCode: primary.PLZ_ZUSTELLBEZIRK,
    beklagteCourtCity: primary.ORT,
    secondaryCourtName: secondary.BEZEICHNUNG,
    secondaryCourtStreetAndNumber: secondary.STR_HNR,
    secondaryCourtZipCode: secondary.PLZ_ZUSTELLBEZIRK,
    secondaryCourtCity: secondary.ORT,
  };
};

export const getResponsibleCourtString = (
  context: GeldEinklagenFormularUserData,
) => {
  const court = getResponsibleCourt(context);

  if (!court) {
    return {};
  }

  return {
    responsibleCourtName: court.BEZEICHNUNG,
    responsibleCourtStreetAndNumber: court.STR_HNR,
    responsibleCourtZipCode: court.PLZ_ZUSTELLBEZIRK,
    responsibleCourtCity: court.ORT,
    responsibleCourtWebsite: court.URL1 ?? "",
    responsibleCourtTelephone: court.TEL ?? "",
    responsibleCourtTelephoneNoSpace: court.TEL?.replaceAll(/\s/g, "") ?? "",
  };
};
