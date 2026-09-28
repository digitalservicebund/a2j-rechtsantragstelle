import { flowLifecycleOverridesInHours } from "~/domains/flowLifecycleConfig";
import { type SessionUserData } from ".";

const DEFAULT_TIME_TO_LIVE_SECONDS = 60 * 60 * 24;

export const getMaxAgeLifecycle = () => {
  const maxOverrideHours = Math.max(
    0,
    ...Object.values(flowLifecycleOverridesInHours),
  );
  return Math.max(DEFAULT_TIME_TO_LIVE_SECONDS, maxOverrideHours * 60 * 60);
};

export const getLifecycleTimeBySessionUserData = (context: SessionUserData) => {
  if (context === "main") return DEFAULT_TIME_TO_LIVE_SECONDS; // default for main session

  const lifecycleTimeInHours = flowLifecycleOverridesInHours[context];
  return lifecycleTimeInHours
    ? lifecycleTimeInHours * 60 * 60
    : DEFAULT_TIME_TO_LIVE_SECONDS;
};
