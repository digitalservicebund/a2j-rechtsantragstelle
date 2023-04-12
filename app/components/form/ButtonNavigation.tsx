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
    <div className="button-container flex flex-wrap gap-24 md:flex-row-reverse flex-col-reverse justify-end">
      <Button type="submit" name="_action" value="next">
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>

      {backDestination && (
        <Button href={backDestination} look="tertiary">
          Zurück
        </Button>
      )}
    </div>
  );
}
