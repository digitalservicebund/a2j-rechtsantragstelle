import { type UserData } from "~/domains/userData";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { getPageAndFlowDataFromPathname } from "../../getPageAndFlowDataFromPathname";

export const posValidationFormUserData = async (
  request: Request,
  flowController: ReturnType<typeof buildFlowController>,
  userData: UserData,
) => {
  const { pathname } = new URL(request.url);
  const { currentFlow, stepId } = getPageAndFlowDataFromPathname(pathname);

  const customAnalyticsEventName =
    flowController.getMeta(stepId)?.customAnalyticsEventName;
  if (customAnalyticsEventName) {
    sendCustomAnalyticsEvent({
      request,
      eventName: customAnalyticsEventName,
      properties: userData,
    });
  }

  await executeAsyncFlowActionByStepId(currentFlow, stepId, request);
};
