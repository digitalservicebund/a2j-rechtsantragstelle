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
import { type AngelegenheitInfo } from "~/services/gerichtsfinder/types";
import { getCourtCategory } from "~/domains/geldEinklagen/services/court/getCourtCategory";

const isBerlinPostcode = (postcode: string) => postcode.startsWith("1");

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
  courtCategory: AngelegenheitInfo,
): Result<Jmtd14VTErwerberGerbeh, Unit> => {
  const edgeCases = edgeCasesForPlz(zipCode, courtCategory);

  // Check for the zip code edge cases if street or house number is missing
  if (edgeCases.length > 0 && (!street || !streetNumber)) {
    return Result.err();
  }

  const courtData = findCourt({
    zipCode,
    streetSlug: street,
    houseNumber: streetNumber,
    angelegenheitInfo: courtCategory,
  });

  if (!courtData) {
    return Result.err();
  }

  const courtId = gerbehIndex(buildGerbehIndex(courtData));

  return PILOT_COURTS.has(courtId) ? Result.ok(courtData) : Result.err();
};

export const getPilotCourts = (userData: GeldEinklagenFormularUserData) => {
  const courtCategory = getCourtCategory(userData.sachgebiet);

  const pilotCourts: Jmtd14VTErwerberGerbeh[] = [];

  if (objectKeysNonEmpty(userData, ["postleitzahlBeklagtePerson"])) {
    const resultPilotCourtBeklagte = getPilotCourt(
      userData.postleitzahlBeklagtePerson,
      userData.strasseBeklagte,
      userData.strasseNummerBeklagte,
      courtCategory,
    );

    if (resultPilotCourtBeklagte.isOk) {
      pilotCourts.push(resultPilotCourtBeklagte.value);
    }
  }

  if (objectKeysNonEmpty(userData, ["postleitzahlSecondary"])) {
    const resultPilotCourtBeklagte = getPilotCourt(
      userData.postleitzahlSecondary,
      userData.strasseSekundaer,
      userData.strasseNummerSekundaer,
      courtCategory,
    );

    if (
      resultPilotCourtBeklagte.isOk &&
      !pilotCourts.includes(resultPilotCourtBeklagte.value)
    ) {
      pilotCourts.push(resultPilotCourtBeklagte.value);
    }
  }

  if (userData.sachgebiet === "verkehrsunfall") {
    const berlinCourts = pilotCourts.filter((court) =>
      isBerlinPostcode(court.PLZ_ZUSTELLBEZIRK),
    );
    const nonBerlinCourts = pilotCourts.filter(
      (court) => !isBerlinPostcode(court.PLZ_ZUSTELLBEZIRK),
    );

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
  }

  return pilotCourts;
};
