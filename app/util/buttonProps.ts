import type { NavigationButton } from "~/components/form/ButtonNavigation";

export function buttonProps(
  label: string,
  destination?: string,
): NavigationButton {
  return { destination, label };
}
