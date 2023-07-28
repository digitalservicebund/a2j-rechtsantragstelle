import Container from "./Container";
import Button from "./Button";
import type { useRouteError } from "@remix-run/react";
import { isRouteErrorResponse } from "@remix-run/react";

type ErrorPage = {
  statuscode: number;
  title: string;
  message: React.ReactElement | string;
};

export function errorPageFromRouteError(
  routeError: ReturnType<typeof useRouteError>,
) {
  const errorPage: ErrorPage = {
    statuscode: 0,
    title: "Unbekannter Fehler",
    message:
      "Es tut uns leid, ein unbekannter Fehler ist aufgetreten. Versuche es später noch einmal.",
  };

  if (isRouteErrorResponse(routeError)) {
    errorPage.statuscode = routeError.status;
    if (routeError.status === 404) {
      errorPage.title = "Seite konnte nicht gefunden werden";
      errorPage.message = (
        <p>
          Es tut uns leid. Diese Seite gibt es nicht mehr oder ihr Name wurde
          geändert.
          <ul>
            <li>
              Wenn Sie die URL direkt eingegeben haben, überprüfen Sie die
              Schreibweise.
            </li>
            <li>
              Versuchen Sie, die Seite von der Startseite aus erneut zu finden.
            </li>
          </ul>
        </p>
      );
    } else {
      errorPage.message = routeError.statusText;
    }
  } else if (typeof routeError === "string") {
    errorPage.message = routeError.toUpperCase();
  } else if (routeError instanceof Error) {
    errorPage.message = routeError.message;
  }
  return errorPage;
}

export default function ErrorBox({ statuscode, title, message }: ErrorPage) {
  return (
    <div className="border-t-2 border-gray-400">
      <Container>
        <div className="ds-stack-16">
          <p className="text-base">{statuscode}</p>
          <h2 className="ds-heading-02-reg">{title}</h2>
          <p>{message}</p>
          <div>
            <Button
              text="Zurück zur Startseite"
              href="/"
              look="primary"
              size="large"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
