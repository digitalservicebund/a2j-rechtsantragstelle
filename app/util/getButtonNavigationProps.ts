import type { z } from "zod";
import type { StrapiVorabCheckCommonSchema } from "~/services/cms/models/StrapiVorabCheckCommon";
import type { Meta } from "~/services/flow/server/buildFlowController";

export const getButtonNavigationProps = ({
  commonContent,
  nextButtonLabel,
  configMetadata,
  previousStepUrl,
  isFinal,
}: {
  commonContent: z.infer<typeof StrapiVorabCheckCommonSchema>;
  nextButtonLabel?: string | null;
  configMetadata?: Meta;
  previousStepUrl?: string;
  isFinal: boolean;
}) => {
  return {
    next:
      isFinal && !configMetadata?.buttonNavigationProps?.next
        ? undefined
        : {
            label: nextButtonLabel ?? commonContent.nextButtonDefaultLabel,
            destination:
              configMetadata?.buttonNavigationProps?.next?.destination,
          },
    back: {
      destination: previousStepUrl,
      label: commonContent.backButtonDefaultLabel,
    },
  };
};
