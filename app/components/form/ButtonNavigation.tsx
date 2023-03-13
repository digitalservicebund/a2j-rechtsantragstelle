import { Link } from "@remix-run/react";
import type { AllowedIDs } from "~/lib/vorabcheck";
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
      <Link
        // todo: fix back button doesn't apply cookie
        to={backDestination ? `../${backDestination}` : "/"}
        style={{ pointerEvents: !backDestination ? "none" : "auto" }}
        className={`no-underline ${
          backDestination ? "text-blue-600" : "text-gray-300"
        }`}
      >
        {"Zurück"}
      </Link>

      <Button type="submit" name="_action" value="next">
        {isLast
          ? "Von Vorne beginnen"
          : backDestination
          ? "Übernehmen & Weiter"
          : "Start"}
      </Button>
    </div>
  );
}
