import { Link } from "@remix-run/react";
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
    <div style={{ margin: "1rem 0" }}>
      <Link
        to={backDestination ? `../${backDestination}` : "/"}
        style={{ pointerEvents: !backDestination ? "none" : "auto" }}
        className={`no-underline ${
          backDestination ? "text-blue-600" : "text-gray-300"
        }`}
      >
        {"Zurück"}
      </Link>

      <Button type="submit" name="_action" value="next">
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>
    </div>
  );
}
