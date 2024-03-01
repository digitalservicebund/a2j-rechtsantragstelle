import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";

export function getButtonNavigationProps({
  backButtonLabel,
  nextButtonLabel,
  isFinal,
  backDestination,
}: {
  backButtonLabel: string;
  nextButtonLabel: string;
  isFinal?: boolean;
  backDestination?: string;
}): ButtonNavigationProps {
  return {
    back: { label: backButtonLabel, destination: backDestination },
    next: isFinal ? undefined : { label: nextButtonLabel },
  };
}
