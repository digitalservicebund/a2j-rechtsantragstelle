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

  if (courts.length === 2) {
    const [beklagteCourt, secondaryCourt] = courts;
    return pilotGerichtAuswahl === "beklagteCourt"
      ? beklagteCourt
      : secondaryCourt;
  }

  return courts[0];
};
