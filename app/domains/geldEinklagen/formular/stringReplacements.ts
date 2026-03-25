import { gerichtskostenFromBetrag } from "~/domains/shared/formular/onlineVerfahren/getCourtCost";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
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
    return {
      oneAvailableCourt: courts.length === 1,
    };
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

export const hasExclusivePlaceJurisdictionOrSelectCourt = ({
  sachgebiet,
  mietePachtRaum,
  mietePachtVertrag,
  gerichtsstandsvereinbarung,
  beklagtePersonGeldVerdienen,
  pilotGerichtAuswahl,
}: GeldEinklagenFormularUserData) => {
  return {
    hasExclusivePlaceJurisdictionOrSelectCourt:
      (sachgebiet === "miete" &&
        mietePachtVertrag === "yes" &&
        mietePachtRaum === "yes") ||
      gerichtsstandsvereinbarung === "yes" ||
      (sachgebiet === "urheberrecht" && beklagtePersonGeldVerdienen === "no") ||
      pilotGerichtAuswahl !== undefined,
  };
};

export const isCourtAGSchoeneberg = (
  context: GeldEinklagenFormularUserData,
) => {
  const court = getResponsibleCourt(context);

  return {
    isCourtAGSchoeneberg:
      court?.PLZ_ZUSTELLBEZIRK === "10823" &&
      court.BEZEICHNUNG.includes("Schöneberg"),
  };
};

export const getCourtCost = (context: GeldEinklagenFormularUserData) => {
  const totalCompensation = parseCurrencyStringDE(
    context.forderungGesamtbetrag,
  );
  const cost = gerichtskostenFromBetrag(totalCompensation);
  return {
    courtCost: cost.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
};

export const hasAnwaltskosten = (context: GeldEinklagenFormularUserData) => {
  const parsedAnwaltskosten = parseCurrencyStringDE(context.anwaltskosten);

  return {
    hasAnwaltskosten: parsedAnwaltskosten > 0,
  };
};

export const hasStreitbeilegungGruende = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    hasStreitbeilegungGruende: context.streitbeilegungGruende === "yes",
  };
};

export const hasBeweiseAngebot = (context: GeldEinklagenFormularUserData) => {
  return {
    hasBeweiseAngebot: context.beweiseAngebot === "yes",
  };
};

export const hasAnwaltschaft = (context: GeldEinklagenFormularUserData) => {
  return {
    hasAnwaltschaft: context.anwaltschaft === "yes",
  };
};

export const hasKlagendePersonStatePlzPrefilled = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    hasKlagendePersonStatePlzPrefilled:
      context.klagendePersonStatePlzPrefilled === "prefilled",
  };
};

export const hasBeklagtePersonStatePlzPrefilled = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    hasBeklagtePersonStatePlzPrefilled:
      context.beklagteStatePlzPrefilled === "prefilled",
  };
};
