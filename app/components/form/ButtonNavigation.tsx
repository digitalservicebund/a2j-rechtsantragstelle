import { Link } from "@remix-run/react";
import type { AllowedIDs } from "~/lib/vorabcheck/pages";
import { Button } from "~/components";
import classNames from "classnames";

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
        to={backDestination ? `../${backDestination}` : "/"}
        style={{ pointerEvents: !backDestination ? "none" : "auto" }}
        className={classNames("no-underline", {
          "text-blue-600": backDestination,
          "text-gray-300": !backDestination,
        })}
      >
        {"Zurück"}
      </Link>

      <Button type="submit" name="_action" value="next">
        {isLast ? "Von Vorne beginnen" : "Übernehmen & Weiter"}
      </Button>
    </div>
  );
}
