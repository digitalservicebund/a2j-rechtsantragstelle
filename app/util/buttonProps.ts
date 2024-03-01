import type { NavigationButton } from "~/components/form/ButtonNavigation";
import type { FlowController } from "~/services/flow/server/buildFlowController";
import type { Translations } from "~/services/cms/index.server";

function buttonProps(label: string, destination?: string): NavigationButton {
  return { destination, label };
}

export function getButtonNavigationProps({
  flowController,
  stepId,
  nextButtonLabel,
  defaultStrings,
  returnTo,
}: {
  flowController: FlowController;
  stepId: string;
  nextButtonLabel?: string | null;
  defaultStrings: Translations;
  returnTo?: string;
}) {
  return {
    next: flowController.isFinal(stepId)
      ? undefined
      : buttonProps(
          nextButtonLabel ?? defaultStrings["nextButtonDefaultLabel"],
        ),
    back: buttonProps(
      defaultStrings["backButtonDefaultLabel"],
      returnTo ?? flowController.getPrevious(stepId),
    ),
  };
}
