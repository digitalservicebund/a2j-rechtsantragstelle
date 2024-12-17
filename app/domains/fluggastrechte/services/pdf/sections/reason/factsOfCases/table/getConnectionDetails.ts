import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { calculateDuration } from "./calculateDuration";

export const NOT_MEASURE_DID_NOT_ARRIVE_TEXT =
  "Nicht messbar, weil gar nicht angekommen.";

export function getConnectionDetails(userData: FluggastrechtContext) {
  const {
    tatsaechlicherFlug,
    ersatzverbindungArt,
    direktAnkunftsDatum,
    direktAnkunftsZeit,
  } = userData;

  if (tatsaechlicherFlug === "yes") {
    const info = calculateDuration({
      startDate: direktAnkunftsDatum ?? "",
      startTime: direktAnkunftsZeit ?? "",
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
    case "flug": {
      const info = calculateDuration({
        startDate: direktAnkunftsDatum ?? "",
        startTime: direktAnkunftsZeit ?? "",
        endDate: userData.ersatzFlugAnkunftsDatum ?? "",
        endTime: userData.ersatzFlugAnkunftsZeit ?? "",
      });
      return {
        info,
        timeTable: [
          userData.ersatzFlugnummer ?? "--",
          "--",
          `${userData.ersatzFlugAnkunftsDatum}, ${userData.ersatzFlugAnkunftsZeit}`,
        ],
      };
    }
    case "etwasAnderes": {
      const info = calculateDuration({
        startDate: direktAnkunftsDatum ?? "",
        startTime: direktAnkunftsZeit ?? "",
        endDate: userData.andereErsatzverbindungAnkunftsDatum ?? "",
        endTime: userData.andereErsatzverbindungAnkunftsZeit ?? "",
      });
      return {
        info,
        timeTable: [
          "--",
          "--",
          `${userData.andereErsatzverbindungAnkunftsDatum}, ${userData.andereErsatzverbindungAnkunftsZeit}`,
        ],
      };
    }
    case "keineAnkunft":
      return {
        info: NOT_MEASURE_DID_NOT_ARRIVE_TEXT,
        timeTable: ["--", "--", "--"],
      };
    default:
      return { info: "error", timeTable: ["error", "error", "error"] };
  }
}
