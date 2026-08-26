import { type SessionUserData } from ".";

const DEFAULT_TIME_TO_LIVE_SECONDS = 60 * 60 * 24;

// Lazy-loaded flows to avoid circular dependencies and module initialization issues
let _flows: any = null;

// TODO: Remove it after the migration to the new engine is done. This is a workaround to get the flows only when needed.
const getFlows = () => {
  if (!_flows) {
    // Dynamic import with require to load flows only when needed
    try {
      _flows = require("~/domains/flows.server").flows;
    } catch {
      // In SSR/test environment, use import
      import("~/domains/flows.server").then((mod) => {
        _flows = mod.flows;
      });
    }
  }
  return _flows;
};

export const getMaxAgeLifecycle = () => {
  const flows = getFlows();
  if (!flows) return DEFAULT_TIME_TO_LIVE_SECONDS;

  let max = DEFAULT_TIME_TO_LIVE_SECONDS;
  Object.entries(flows).forEach(([flow]) => {
    const lifecycleTimeInSeconds = getLifecycleTimeBySessionUserData(
      flow as SessionUserData,
    );
    if (lifecycleTimeInSeconds > max) {
      max = lifecycleTimeInSeconds;
    }
  });
  return max;
};

export const getLifecycleTimeBySessionUserData = (context: SessionUserData) => {
  if (context === "main") return DEFAULT_TIME_TO_LIVE_SECONDS; // default for main session

  const flowsWorkaround = getFlows();
  if (!flowsWorkaround) return DEFAULT_TIME_TO_LIVE_SECONDS;

  const flowConfig = flowsWorkaround[context];
  return "lifecycleTimeInHours" in flowConfig &&
    typeof flowConfig.lifecycleTimeInHours === "number"
    ? flowConfig.lifecycleTimeInHours * 60 * 60
    : DEFAULT_TIME_TO_LIVE_SECONDS;
};
