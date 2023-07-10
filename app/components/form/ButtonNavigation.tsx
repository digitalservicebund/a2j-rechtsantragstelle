import { Button } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import type { StrapiVorabCheckCommon } from "~/services/cms/models/StrapiVorabCheckCommon";

interface ButtonNavigationProps {
  backDestination?: string;
  isLast: boolean;
  commonContent: StrapiVorabCheckCommon;
}

export function ButtonNavigation({
  commonContent,
  backDestination,
  isLast,
}: ButtonNavigationProps) {
  return (
    <ButtonContainer reverseOrder={true}>
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
