import { guards as fluggastrechteVorabcheckGuards } from "~/models/flows/fluggastrechte/guards";
import fluggastrechteVorabcheckFlow from "~/models/flows/fluggastrechte/config.json";
import { fluggastrechteVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";

export const fluggastrechteVorabcheck = {
  cmsSlug: "vorab-check-pages",
  flow: fluggastrechteVorabcheckFlow,
  guards: fluggastrechteVorabcheckGuards,
  context: fluggastrechteVorabcheckContext,
} as const;

export const partnerCourtAirports = {
  BRE: "28199",
  BER: "12529",
  DUS: "40474",
  FRA: "60549", // eigtl 60547
  HAM: "22335",
  MUC: "85356",
  STR: "70629",
} as const;

function partnerCourtFromAirport(airport: string) {
  if (airport in partnerCourtAirports) {
    const zipCode =
      partnerCourtAirports[airport as keyof typeof partnerCourtAirports];
    return findCourt({ zipCode });
  }
}

export const partnerCourtFromAirports = (airports: string[]) =>
  airports
    .map(partnerCourtFromAirport)
    .filter((airport) => airport) as Jmtd14VTErwerberGerbeh[];
