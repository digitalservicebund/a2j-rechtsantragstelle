import { Link } from "@remix-run/react";
import type { NullableIDs } from "~/lib/formDefinition";

interface ButtonNavigationProps {
  backDestination: NullableIDs;
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

      <button type="submit" name="_action" value="next">
        {isLast
          ? "Von Vorne beginnen"
          : backDestination
          ? "Nächste Seite"
          : "Start"}
      </button>
    </div>
  );
}
