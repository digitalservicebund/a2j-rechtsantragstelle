import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { calculateDuration } from "./calculateDuration";

export function getConnectionDetails(userData: FluggastrechtContext) {
  const { tatsaechlicherFlug, ersatzverbindungArt } = userData;

  if (tatsaechlicherFlug === "yes") {
    const info = calculateDuration({
      startDate: userData.direktAnkunftsDatum ?? "",
      startTime: userData.direktAnkunftsZeit ?? "",
      endDate: userData.tatsaechlicherAnkunftsDatum ?? "",
      endTime: userData.tatsaechlicherAnkunftsZeit ?? "",
    });
    return {
      info,
      timeTable: [
        "--",
        "--",
        `${userData.tatsaechlicherAnkunftsDatum}, ${userData.tatsaechlicherAnkunftsZeit}`,
      ],
    };
  }

  switch (ersatzverbindungArt) {
    case "flug":
      return {
        info: `Mit einem anderen Flug, ${calculateDuration({
          startDate: userData.direktAnkunftsDatum ?? "",
          startTime: userData.direktAnkunftsZeit ?? "",
          endDate: userData.ersatzFlugAnkunftsDatum ?? "",
          endTime: userData.ersatzFlugAnkunftsZeit ?? "",
        })}`,
        timeTable: [
          userData.ersatzFlugnummer ?? "--",
          "--",
          `${userData.ersatzFlugAnkunftsDatum}, ${userData.ersatzFlugAnkunftsZeit}`,
        ],
      };
    case "etwasAnderes":
      return {
        info: `Mit Bahn, Bus oder anderen Verkehrsmitteln, ${calculateDuration({
          startDate: userData.direktAnkunftsDatum ?? "",
          startTime: userData.direktAnkunftsZeit ?? "",
          endDate: userData.andereErsatzverbindungAnkunftsDatum ?? "",
          endTime: userData.andereErsatzverbindungAnkunftsZeit ?? "",
        })}`,
        timeTable: [
          "--",
          "--",
          `${userData.andereErsatzverbindungAnkunftsDatum}, ${userData.andereErsatzverbindungAnkunftsZeit}`,
        ],
      };
    case "keineAnkunft":
      return { info: "--", timeTable: ["--", "--", "--"] };
  }
  return { info: "error", timeTable: ["error", "error", "error"] };
}
