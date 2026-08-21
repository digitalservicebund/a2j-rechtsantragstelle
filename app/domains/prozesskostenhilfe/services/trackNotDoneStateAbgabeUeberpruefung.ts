import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { type ProzesskostenhilfeFormularUserData } from "../formular/userData";

const getNotDoneStates = (userData: ProzesskostenhilfeFormularUserData) => {
  if (!userData.pageData?.subflowDoneStates) {
    return {};
  }

  return (
    !!userData.pageData?.subflowDoneStates &&
    Object.entries(userData.pageData.subflowDoneStates)
      .filter(([stepId]) => !stepId.startsWith("/abgabe"))
      .filter(([, subflowDone]) => !subflowDone)
  );
};

const trackNotDoneStateAbgabeUeberpruefung = (
  request: Request,
  userData: ProzesskostenhilfeFormularUserData,
) => {
  const notDoneStates = getNotDoneStates(userData);

  if (Object.keys(notDoneStates).length === 0) {
    return Promise.resolve();
  }

  return Promise.resolve(
    sendCustomAnalyticsEvent({
      request,
      eventName: "abgabe ueberpruefung not done states",
      properties: {
        notDoneStates: notDoneStates,
      },
    }),
  );
};

export default trackNotDoneStateAbgabeUeberpruefung;
