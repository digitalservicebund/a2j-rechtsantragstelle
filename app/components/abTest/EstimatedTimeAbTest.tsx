import TimerOutlinedIcon from "@digitalservicebund/icons/TimerOutlined";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useLocation } from "react-router";
import { config } from "~/services/env/web";

export function EstimatedTimeAbTest() {
  const { pathname } = useLocation();
  function useDisplayEstimatedTimeAbTest(): boolean {
    if (!config().POSTHOG_API_KEY) {
      return false;
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const variantKey = useFeatureFlagVariantKey("conversion-rate-pkh-flow");
    const isOnPKHFlowStartPage = pathname.includes(
      "/prozesskostenhilfe/formular/start/start",
    );
    const isTestGroup = variantKey === "test";

    return isOnPKHFlowStartPage && isTestGroup;
  }

  const displayEstimatedTime = useDisplayEstimatedTimeAbTest();

  return (
    <>
      {displayEstimatedTime && (
        <span className="flex items-center ds-body-02-reg text-gray-900">
          <TimerOutlinedIcon className="shrink-0 fill-gray-900 mr-4" />
          {"Geschätzte Zeit: 20 Minuten"}
        </span>
      )}
    </>
  );
}
