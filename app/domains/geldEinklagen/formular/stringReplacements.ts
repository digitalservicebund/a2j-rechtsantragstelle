import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/services/court/getCourtCost";
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
  const totalCompensation = Number(context.forderungGesamtbetrag);
  return {
    courtCost: gerichtskostenFromBetrag(totalCompensation).toLocaleString(
      "de-DE",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    ),
  };
};

export const getKlagendePersonInfo = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    klagendePersonAnrede: context.klagendePersonAnrede,
    klagendePersonTitle: context.klagendePersonTitle,
    klagendePersonVorname: context.klagendePersonVorname,
    klagendePersonNachname: context.klagendePersonNachname,
    klagendePersonStrasseHausnummer: context.klagendePersonStrasseHausnummer,
    klagendePersonPlz: context.klagendePersonPlz,
    klagendePersonOrt: context.klagendePersonOrt,
    klagendeTelefonnummer: context.klagendeTelefonnummer,
    klagendePersonIban: context.klagendePersonIban,
    klagendePersonKontoinhaber: context.klagendePersonKontoinhaber,
  };
};

export const getBeklagtePersonInfo = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    beklagteAnrede: context.beklagteAnrede,
    beklagteTitle: context.beklagteTitle,
    beklagteVorname: context.beklagteVorname,
    beklagteNachname: context.beklagteNachname,
    beklagteStrasseHausnummer: context.beklagteStrasseHausnummer,
    beklagtePlz: context.beklagtePlz,
    beklagteOrt: context.beklagteOrt,
  };
};

export const getSachverhaltInfo = (context: GeldEinklagenFormularUserData) => {
  return {
    forderungGesamtbetrag: context.forderungGesamtbetrag,
    sachverhaltBegruendung: context.sachverhaltBegruendung,
    beweiseAngebot: context.beweiseAngebot,
  };
};

export const getProzesszinsenInfo = (
  context: GeldEinklagenFormularUserData,
) => {
  return {
    prozesszisnsen: context.prozesszinsen,
    anwaltskosten: context.anwaltskosten,
    streitbeilegung: context.streitbeilegung,
    muendlicheVerhandlung: context.muendlicheVerhandlung,
    videoVerhandlung: context.videoVerhandlung,
    versaeumnisurteil: context.versaeumnisurteil,
  };
};

export const getZusaetzlicheAngabenInfo = (context: GeldEinklagenFormularUserData) => {
  return {
    weitereAntraege: context.weitereAntraege,
    rechtlicheWuerdigung: context.rechtlicheWuerdigung,
  };
};
