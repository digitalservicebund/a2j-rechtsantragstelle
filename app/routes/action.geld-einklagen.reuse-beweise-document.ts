import { type ActionFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { redirectDocument } from "react-router";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/BegruendungBeschreibungUebersicht";

const BASE_URL_PAGE_REUSE_DOCUMENT = "beweis-dokument-wiederverwenden";

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
  const BASE_URL_PAGE_ADD_NEW_DOCUMENT = `/dokumenten/${nextItemBeweis}/daten`;
  const redirectUrl = `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/${
    reuseOption === "reuse"
      ? BASE_URL_PAGE_REUSE_DOCUMENT
      : BASE_URL_PAGE_ADD_NEW_DOCUMENT
  }`;

  return redirectDocument(redirectUrl);
};
