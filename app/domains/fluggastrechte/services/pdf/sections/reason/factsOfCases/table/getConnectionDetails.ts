import isEmpty from "lodash/isEmpty";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FluggastrechtAnkuendigungType } from "~/domains/fluggastrechte/vorabcheck/context";
import { calculateDuration } from "./calculateDuration";

const announcementMapping = {
  no: "Gar nicht vor Abflug mitgeteilt.",
  until6Days: "0 bis 6 Tage vor Abflug mitgeteilt.",
  between7And13Days: "7-13 Tage vor Abflug mitgeteilt.",
  moreThan13Days: "",
};

type ConnectionDetailsType = {
  info: string;
  timeTable: string[];
};

export const NOT_MEASURE_DID_NOT_ARRIVE_TEXT =
  "Nicht messbar, weil gar nicht angekommen.";

export const OFFERED_REPLACEMENT_FLIGHT = "Angebot der Ersatzverbindung ist";
export const MORE_THAN = "mehr als";
export const LESS_THAN = "weniger als";
export const LATER_ARRIVED = "später angekommen.";
export const EARLIER_STARTED = "früher gestartet";
export const NO_OFFER_REPLACEMENT_RECEIVED_TEXT =
  "Kein Angebot einer Ersatzverbindung erhalten.";

const getReplacementFlightLandedDescription = (
  userData: FluggastrechtContext,
): string => {
  const {
    ersatzflugLandenZweiStunden,
    ersatzflugLandenVierStunden,
    ankuendigung,
  } = userData;

  if (ankuendigung === "between7And13Days") {
    return ersatzflugLandenVierStunden === "yes"
      ? `${MORE_THAN} 4 Stunden ${LATER_ARRIVED}`
      : `${LESS_THAN} 4 Stunden ${LATER_ARRIVED}`;
  }

  return ersatzflugLandenZweiStunden === "yes"
    ? `${MORE_THAN} 2 Stunden ${LATER_ARRIVED}`
    : `${LESS_THAN} 2 Stunden ${LATER_ARRIVED}`;
};

const getReplacementFlightDepartureDescription = (
  userData: FluggastrechtContext,
): string => {
  const {
    ersatzflugStartenEinStunde,
    ersatzflugStartenZweiStunden,
    ankuendigung,
  } = userData;

  if (ankuendigung === "between7And13Days") {
    return ersatzflugStartenZweiStunden === "yes"
      ? `${MORE_THAN} 2 Stunden ${EARLIER_STARTED}`
      : `${LESS_THAN} 2 Stunden ${EARLIER_STARTED}`;
  }

  return ersatzflugStartenEinStunde === "yes"
    ? `${MORE_THAN} 1 Stunde ${EARLIER_STARTED}`
    : `${LESS_THAN} 1 Stunde ${EARLIER_STARTED}`;
};

const getReplacementFlightDescription = (
  userData: FluggastrechtContext,
): string => {
  const { ersatzflug } = userData;

  if (ersatzflug === "no") {
    return NO_OFFER_REPLACEMENT_RECEIVED_TEXT;
  }

  const replacementDeparture =
    getReplacementFlightDepartureDescription(userData);
  const replacementLanded = getReplacementFlightLandedDescription(userData);

  return `${OFFERED_REPLACEMENT_FLIGHT} ${replacementDeparture} und ${replacementLanded}`;
};

const formatAnnullierungDateHour = (date?: string, hour?: string) => {
  if (isEmpty(date) || isEmpty(hour)) {
    return "--";
  }

  return `${date}, ${hour}`;
};

const getConnectionDetailsCancel = (
  userData: FluggastrechtContext,
): ConnectionDetailsType => {
  const {
    ankuendigung,
    annullierungErsatzverbindungAbflugsDatum,
    annullierungErsatzverbindungAbflugsZeit,
    annullierungErsatzverbindungAnkunftsDatum,
    annullierungErsatzverbindungAnkunftsZeit,
    annullierungErsatzverbindungFlugnummer,
  } = userData;

  const announcementDescription =
    announcementMapping[(ankuendigung as FluggastrechtAnkuendigungType) ?? ""];

  const replacementFlightDescription =
    getReplacementFlightDescription(userData);

  return {
    info: `${announcementDescription}\n${replacementFlightDescription}`,
    timeTable: [
      annullierungErsatzverbindungFlugnummer || "--",
      formatAnnullierungDateHour(
        annullierungErsatzverbindungAbflugsDatum,
        annullierungErsatzverbindungAbflugsZeit,
      ),
      formatAnnullierungDateHour(
        annullierungErsatzverbindungAnkunftsDatum,
        annullierungErsatzverbindungAnkunftsZeit,
      ),
    ],
  };
};

function getConnectionDetailsDelayOrNoBoarding(
  userData: FluggastrechtContext,
): ConnectionDetailsType {
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

export function getConnectionDetails(userData: FluggastrechtContext) {
  const { bereich } = userData;

  if (bereich === "annullierung") {
    return getConnectionDetailsCancel(userData);
  }

  return getConnectionDetailsDelayOrNoBoarding(userData);
}
