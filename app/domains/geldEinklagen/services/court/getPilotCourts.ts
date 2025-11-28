import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { type GeldEinklagenFormularUserData } from "../../formular/userData";
import {
  type GerbehIndex,
  gerbehIndex,
} from "~/services/gerichtsfinder/convertJsonDataTable";
import { type Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { Result, type Unit } from "true-myth";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { PILOT_COURTS } from "./pilotCourts";

const buildGerbehIndex = (data: Jmtd14VTErwerberGerbeh): GerbehIndex => {
  return {
    LKZ: data.LKZ,
    OLG: data.OLG,
    LG: data.LG,
    AG: data.AG,
    typInfo: data.TYP_INFO,
  };
};

const getPilotCourt = (
  zipCode: string,
  street: string | undefined,
  streetNumber: string | undefined,
): Result<Jmtd14VTErwerberGerbeh, Unit> => {
  const edgeCases = edgeCasesForPlz(zipCode);

  // Check for the zip code edge cases if street or house number is missing
  if (edgeCases.length > 0 && (!street || !streetNumber)) {
    return Result.err();
  }

  const courtData = findCourt({
    zipCode,
    streetSlug: street,
    houseNumber: streetNumber,
  });

  if (!courtData) {
    return Result.err();
  }

  const courtId = gerbehIndex(buildGerbehIndex(courtData));

  return PILOT_COURTS.has(courtId) ? Result.ok(courtData) : Result.err();
};

export const getPilotCourts = (userData: GeldEinklagenFormularUserData) => {
  const pilotCourts: Jmtd14VTErwerberGerbeh[] = [];

  if (objectKeysNonEmpty(userData, ["postleitzahlBeklagtePerson"])) {
    const resultPiloTCourtBeklagte = getPilotCourt(
      userData.postleitzahlBeklagtePerson,
      userData.strasseBeklagte,
      userData.strasseNummerBeklagte,
    );

    if (resultPiloTCourtBeklagte.isOk) {
      pilotCourts.push(resultPiloTCourtBeklagte.value);
    }
  }

  if (objectKeysNonEmpty(userData, ["postleitzahlSecondary"])) {
    const resultPiloTCourtBeklagte = getPilotCourt(
      userData.postleitzahlSecondary,
      userData.strasseSekundaer,
      userData.strasseNummerSekundaer,
    );

    if (resultPiloTCourtBeklagte.isOk) {
      pilotCourts.push(resultPiloTCourtBeklagte.value);
    }
  }

  return pilotCourts;
};
