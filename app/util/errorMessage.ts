import type { useRouteError } from "@remix-run/react";
import { isRouteErrorResponse } from "@remix-run/react";

export default function errorMessage(error: ReturnType<typeof useRouteError>) {
  let errorMessage = "Unbekannter Fehler";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage =
        "Die angefragte Seite konnte leider nicht gefunden werden.";
    } else {
      errorMessage = error.data.message;
    }
  } else if (typeof error === "string") {
    errorMessage = error.toUpperCase();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
}
