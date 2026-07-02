import { type Flow } from "~/domains/flows.server";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type FlowMetaConfiguration = NonNullable<Flow["metaConfiguration"]>[string];

const metaConfigurationBooleanKeys: Array<keyof FlowMetaConfiguration> = [
  "excludedFromValidation",
  "triggerValidation",
  "shouldAppearAsMenuNavigation",
];

const mergeMetaConfiguration = (
  current: FlowMetaConfiguration,
  incoming: FlowMetaConfiguration,
): FlowMetaConfiguration => {
  const merged: FlowMetaConfiguration = { ...current };

  for (const key of metaConfigurationBooleanKeys) {
    const incomingValue = incoming[key];
    if (incomingValue === undefined) {
      continue;
    }

    // A `true` flag should always remain enabled for descendants.
    if (incomingValue || merged[key] !== true) {
      merged[key] = incomingValue;
    }
  }

  return merged;
};

export const getMetaConfigurationByStepId = (
  flow: Flow,
  stepId: string,
): FlowMetaConfiguration | undefined => {
  if (!objectKeysNonEmpty(flow, ["metaConfiguration"])) {
    return undefined;
  }

  const normalizedStepId = stepId.startsWith("/") ? stepId : `/${stepId}`;
  const stepIdSegments = normalizedStepId.split("/").filter(Boolean);

  const mergedMetaConfiguration = stepIdSegments.reduce<FlowMetaConfiguration>(
    (result, _, index) => {
      const path = `/${stepIdSegments.slice(0, index + 1).join("/")}`;
      const metaConfiguration = flow.metaConfiguration?.[path];

      if (!metaConfiguration) {
        return result;
      }

      return mergeMetaConfiguration(result, metaConfiguration);
    },
    {},
  );

  return Object.keys(mergedMetaConfiguration).length > 0
    ? mergedMetaConfiguration
    : undefined;
};
