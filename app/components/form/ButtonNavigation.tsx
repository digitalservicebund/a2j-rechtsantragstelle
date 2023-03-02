import { useNavigate } from "@remix-run/react";
import type { NullableIDs } from "~/lib/formDefinition";

interface ButtonNavigationProps {
  backDestination: NullableIDs;
  isLast: boolean;
}

export function ButtonNavigation({
  backDestination,
  isLast,
}: ButtonNavigationProps) {
  // TODO: useNavigate() doesn't work without JS. Classic Link, styled as button?
  const navigate = useNavigate();

  return (
    <pre>
      <button
        type="button"
        onClick={() => navigate(`/form/${backDestination}`)}
        disabled={!backDestination}
      >
        {"Zurück"}
      </button>
      <button type="submit" name="_action" value="next">
        {isLast ? "Abschicken" : "Nächste Seite"}
      </button>
    </pre>
  );
}
