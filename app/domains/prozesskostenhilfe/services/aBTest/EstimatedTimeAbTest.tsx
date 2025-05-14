import TimerOutlinedIcon from "@digitalservicebund/icons/TimerOutlined";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useLocation } from "react-router";

export function EstimatedTimeAbTest() {
  /**
   * Hook to determine whether to display the estimated time string and icon.
   *
   * The hook uses the PostHog useFeatureFlagVariantKey hook to determine whether the
   * user is in the test or control group of the "conversion-rate-pkh-flow" feature flag.
   *
   * If the user is on the start page of the PKH flow and is in the test group, the hook
   * returns true. Otherwise, it returns false.
   *
   * @returns {boolean} Whether to display the estimated time string and icon.
   */
  function useDisplayEstimatedTimeAbTest() {
    const { pathname } = useLocation();
    const variantKey = useFeatureFlagVariantKey("conversion-rate-pkh-flow");
    const isOnPKHFlowStartPage = pathname.includes(
      "prozesskostenhilfe/formular/start/start",
    );
    const isTestGroup = variantKey === "test";

    return isOnPKHFlowStartPage && isTestGroup;
  }

  return (
    <>
      {useDisplayEstimatedTimeAbTest() && (
        <span className="flex items-center ds-body-02-reg text-gray-900">
          <TimerOutlinedIcon className="shrink-0 fill-gray-900 mr-4" />
          {"Geschätzte Zeit: 20 Minuten"}
        </span>
      )}
    </>
  );
}
