import type { AllowedIDs } from "~/lib/vorabcheck/pages";
import { Button } from "~/components";
import { ButtonContainer } from "~/components/ButtonContainer";

interface ButtonNavigationProps {
  backDestination?: AllowedIDs;
  isLast: boolean;
}

export function ButtonNavigation({
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
          Zurück
        </Button>
      )}

      <Button
        type="submit"
        name="_action"
        value="next"
        size="large"
        className="w-fit"
      >
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>
    </ButtonContainer>
  );
}
