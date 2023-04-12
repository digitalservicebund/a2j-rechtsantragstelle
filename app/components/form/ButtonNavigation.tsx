import type { AllowedIDs } from "~/lib/vorabcheck/pages";
import { Button } from "~/components";

interface ButtonNavigationProps {
  backDestination?: AllowedIDs;
  isLast: boolean;
}

export function ButtonNavigation({
  backDestination,
  isLast,
}: ButtonNavigationProps) {
  return (
    <div>
      {backDestination && (
        <Button href={backDestination} look="tertiary">
          Zurück
        </Button>
      )}

      <Button type="submit" name="_action" value="next">
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>
    </div>
  );
}
