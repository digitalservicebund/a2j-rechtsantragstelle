import { Button } from "~/components";
import { ButtonContainer } from "~/components/ButtonContainer";
import type { VorabCheckCommons } from "~/services/cms/models/VorabCheckCommons";

interface ButtonNavigationProps {
  backDestination?: string;
  isLast: boolean;
  commonContent: VorabCheckCommons;
}

export function ButtonNavigation({
  commonContent,
  backDestination,
  isLast,
}: ButtonNavigationProps) {
  return (
    <ButtonContainer>
      {backDestination && (
        <Button
          href={backDestination}
          look="tertiary"
          size="large"
          className="w-fit"
        >
          {commonContent.backButtonDefaultLabel}
        </Button>
      )}

      <Button
        type="submit"
        name="_action"
        value="next"
        size="large"
        className="w-fit"
      >
        {isLast
          ? commonContent.lastNextButtonLabel
          : commonContent.nextButtonDefaultLabel}
      </Button>
    </ButtonContainer>
  );
}
