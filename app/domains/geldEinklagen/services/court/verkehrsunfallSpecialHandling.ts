import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";

export const isBerlinCourt = (court: Jmtd14VTErwerberGerbeh) =>
  court.ORT.trim().toUpperCase() === "BERLIN";

export const applyVerkehrsunfallSpecialHandling = (
  pilotCourts: Jmtd14VTErwerberGerbeh[],
): Jmtd14VTErwerberGerbeh[] => {
  const berlinCourts = pilotCourts.filter(isBerlinCourt);
  const nonBerlinCourts = pilotCourts.filter((court) => !isBerlinCourt(court));

  const hasOneCourt = pilotCourts.length === 1;
  const hasOneBerlinCourt = berlinCourts.length === 1;
  const hasTwoCourts = pilotCourts.length === 2;
  const hasOneBerlinAndOneNonBerlin =
    berlinCourts.length === 1 && nonBerlinCourts.length === 1;

  if (hasOneCourt && hasOneBerlinCourt) {
    return [];
  }

  if (hasTwoCourts && hasOneBerlinAndOneNonBerlin) {
    return nonBerlinCourts;
  }

  return pilotCourts;
};
