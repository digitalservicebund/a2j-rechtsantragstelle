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
    <div className="button-container flex flex-wrap gap-24 md:flex-row flex-col-reverse justify-end md:justify-start">
      {backDestination && (
        <Button href={backDestination} look="tertiary" className="w-fit">
          Zurück
        </Button>
      )}

      <Button type="submit" name="_action" value="next" className="w-fit">
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>
    </div>
  );
}
