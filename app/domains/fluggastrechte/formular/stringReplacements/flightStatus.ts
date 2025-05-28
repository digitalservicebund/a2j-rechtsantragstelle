import { type FluggastrechteUserData } from "../userData";

export function isVerspaetet({ bereich = "" }: FluggastrechteUserData) {
  return {
    isVerspaetet: bereich === "verspaetet",
  };
}

export function isNichtBefoerderung({ bereich = "" }: FluggastrechteUserData) {
  return {
    isNichtBefoerderung: bereich === "nichtbefoerderung",
  };
}

export function isAnnullierung({ bereich = "" }: FluggastrechteUserData) {
  return {
    isAnnullierung: bereich === "annullierung",
  };
}

export const getAnnullierungInfo = (context: FluggastrechteUserData) => {
  return {
    hasAnnullierungCase: context.bereich === "annullierung",
    hasNoAnkuendigung: context.ankuendigung === "no",
    hasUntil6DaysAnkuendigung: context.ankuendigung === "until6Days",
    hasBetween7And13DaysAnkuendigung:
      context.ankuendigung === "between7And13Days",
    hasMoreThan13DaysAnkuendigung: context.ankuendigung === "moreThan13Days",
    hasErsatzverbindungAngebot: context.ersatzflug === "yes",
    hasErsatzflugLandenZweiStunden:
      context.ersatzflugLandenZweiStunden === "yes",
    hasErsatzflugLandenVierStunden:
      context.ersatzflugLandenVierStunden === "yes",
    hasErsatzflugStartenEinStunde: context.ersatzflugStartenEinStunde === "yes",
    hasErsatzflugStartenZweiStunden:
      context.ersatzflugStartenZweiStunden === "yes",
  };
};
