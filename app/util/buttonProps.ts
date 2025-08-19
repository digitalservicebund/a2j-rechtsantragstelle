import type { ButtonNavigationProps } from "~/components/common/ButtonNavigation";

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
}) {
  return {
    back: { label: backButtonLabel, destination: backDestination },
    next: isFinal ? undefined : { label: nextButtonLabel },
  } satisfies ButtonNavigationProps;
}
