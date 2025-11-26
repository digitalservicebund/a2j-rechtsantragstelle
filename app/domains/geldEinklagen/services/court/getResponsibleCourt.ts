import type { GeldEinklagenFormularUserData } from "../../formular/userData";
import { getPilotCourts } from "./getPilotCourts";

export const getResponsibleCourt = (context: GeldEinklagenFormularUserData) => {
  const pilotGerichtAuswahl = context.pilotGerichtAuswahl;
  const courts = getPilotCourts(context);

  if (
    courts.length === 0 ||
    (courts.length === 2 && pilotGerichtAuswahl === undefined)
  ) {
    return undefined;
  }

  if (pilotGerichtAuswahl !== undefined && courts.length === 2) {
    const [primary, secondary] = courts;
    return pilotGerichtAuswahl === "beklagteCourt" ? primary : secondary;
  }

  return courts[0];
};
