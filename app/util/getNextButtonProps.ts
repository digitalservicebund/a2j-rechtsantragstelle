import type { NavigationButton } from "~/components/form/ButtonNavigation";

export const getNextButtonProps = ({
  pathname,
  isLast,
  defaultLabel,
  nextButtonLabel,
}: {
  pathname: string;
  isLast: boolean;
  defaultLabel: string;
  nextButtonLabel: string | undefined | null;
}) => {
  const isBeratungshilfeAntrag = pathname.includes("beratungshilfe/antrag");
  const nextButtonProps: NavigationButton = {
    label: defaultLabel,
  };
  // when the last step is reached, the next button should be a download or send button based on pathname of the url
  if (isBeratungshilfeAntrag && isLast) {
    nextButtonProps["destination"] = "/beratungshilfe/antrag/pdf";
    nextButtonProps["downloadFile"] = "Beratungshilfe Antrag.pdf";
  }
  if (nextButtonLabel) nextButtonProps.label = nextButtonLabel;

  return nextButtonProps;
};
