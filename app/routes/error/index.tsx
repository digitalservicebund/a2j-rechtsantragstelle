import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Background, Container } from "~/components";

export function ErrorBoundary() {
  const error = useRouteError();
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

  return (
    <Background backgroundColor="red">
      <Container>
        <div className="ds-stack-16">
          <h1 className="ds-heading-02-reg">Fehler aufgetreten</h1>
          <pre>{errorMessage}</pre>
        </div>
      </Container>
    </Background>
  );
}
