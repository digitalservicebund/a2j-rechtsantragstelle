import { type ActionFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { redirect } from "react-router";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/BegruendungBeschreibungUebersicht";

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const formData = await request.formData();

  const nextItemBeweis = formData.get("nextItemBeweis");
  const itemIndexAbschnitt = formData.get("itemIndexAbschnitt");
  const reuseOption = formData.get("reuse-option");
  const beweiseType = formData.get("beweiseType");
  let redirectUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/`;

  if (reuseOption === "reuse") {
    redirectUrl +=
      beweiseType === "document"
        ? "beweis-dokument-wiederverwenden"
        : "beweis-person-wiederverwenden";
  }

  if (reuseOption === "new") {
    redirectUrl +=
      beweiseType === "document"
        ? `/dokumenten/${nextItemBeweis}/daten`
        : `/personen/${nextItemBeweis}/auswahl`;
  }

  return redirect(redirectUrl);
};
