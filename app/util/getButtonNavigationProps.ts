import _ from "lodash";
import type { Meta } from "~/services/flow/buildFlowController";

export const getButtonNavigationProps = ({
  commonContent,
  cmsContent,
  configMetadata,
  previousStepUrl,
}: {
  commonContent: {
    nextButtonDefaultLabel: string;
    backButtonDefaultLabel: string;
  };
  cmsContent: {
    nextButtonLabel?: string | null;
  };
  configMetadata?: Meta;
  previousStepUrl?: string;
}) => {
  const defaultProps = {
    next: {
      label: commonContent.nextButtonDefaultLabel,
    },
    back: {
      destination: previousStepUrl,
      label: commonContent.backButtonDefaultLabel,
    },
  };

  const cmsProps = cmsContent.nextButtonLabel
    ? {
        next: {
          label: cmsContent.nextButtonLabel,
        },
      }
    : {};

  const configProps = configMetadata?.buttonNavigationProps;

  return _.merge({}, defaultProps, cmsProps, configProps);
};
