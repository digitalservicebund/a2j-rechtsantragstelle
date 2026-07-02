import { type Flow } from "~/domains/flows.server";
import mergeWith from "lodash/mergeWith";

type FlowMetaConfiguration = NonNullable<Flow["metaConfiguration"]>[string];

const getStepHierarchyPaths = (stepId: string): string[] => {
  const stepIdSegments = stepId.trim().split("/").filter(Boolean);

  return stepIdSegments.map(
    (_, index) => `/${stepIdSegments.slice(0, index + 1).join("/")}`,
  );
};

const mergeStickyBooleanFlags = (
  currentValue: unknown,
  incomingValue: unknown,
) => {
  if (typeof currentValue === "boolean" && typeof incomingValue === "boolean") {
    return currentValue || incomingValue;
  }

  return undefined;
};

const mergeMetaConfigurations = (
  current: FlowMetaConfiguration,
  incoming: FlowMetaConfiguration,
): FlowMetaConfiguration =>
  mergeWith(
    {},
    current,
    incoming,
    mergeStickyBooleanFlags,
  ) as FlowMetaConfiguration;

export const getMetaConfigurationByStepId = (
  flow: Flow,
  stepId: string,
): FlowMetaConfiguration | undefined => {
  const flowMetaConfiguration = flow.metaConfiguration;
  if (
    !flowMetaConfiguration ||
    Object.keys(flowMetaConfiguration).length === 0
  ) {
    return undefined;
  }

  let mergedMetaConfiguration: FlowMetaConfiguration | undefined;

  for (const path of getStepHierarchyPaths(stepId)) {
    const currentMetaConfiguration = flowMetaConfiguration[path];
    if (!currentMetaConfiguration) {
      continue;
    }

    mergedMetaConfiguration = mergedMetaConfiguration
      ? mergeMetaConfigurations(
          mergedMetaConfiguration,
          currentMetaConfiguration,
        )
      : { ...currentMetaConfiguration };
  }

  return mergedMetaConfiguration;
};
