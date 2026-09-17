import { type ActionFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { redirectDocument } from "react-router";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/BegruendungBeschreibungUebersicht";
import z from "zod";
import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { getSessionManager, updateSession } from "~/services/session.server";
import merge from "lodash/merge";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

const BASE_URL_PAGE_REUSE_PERSON = "beweis-personen-wiederverwenden";
const BASE_URL_PAGE_UEBERSICHT =
  "/geld-einklagen/formular/klage-erstellen/begruendung/beschreibung/uebersicht#array-summary-item-edit-abschnitte-";

const reuseBeweisePersonSchema = z.object({
  "reuse-option": z.enum(["reuse", "new", "beklagte", "klagende"]),
  nextItemBeweis: z.coerce.number(),
  itemIndexAbschnitt: z.coerce.number(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const formData = await request.formData();

  const result = await parseFormData(formData, reuseBeweisePersonSchema);

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const itemIndexAbschnitt = result.submittedData["itemIndexAbschnitt"];
  const nextItemBeweis = result.submittedData["nextItemBeweis"];
  const reuseOption = result.submittedData["reuse-option"];
  const BASE_URL_PAGE_ADD_NEW_DOCUMENT = `/personen/${nextItemBeweis}/daten`;

  switch (reuseOption) {
    case "reuse":
      return redirectDocument(
        `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/${BASE_URL_PAGE_REUSE_PERSON}`,
      );
    case "beklagte":
    case "new":
    case "klagende": {
      const { getSession, commitSession } = getSessionManager(
        "/geld-einklagen/formular",
      );
      const cookieHeader = request.headers.get("Cookie");
      const flowSession = await getSession(cookieHeader);

      const currentAbschnitte = (
        flowSession.data as GeldEinklagenFormularUserData
      ).abschnitte;

      if (currentAbschnitte === undefined) {
        return redirectDocument(BASE_URL_PAGE_UEBERSICHT);
      }

      const currentPersonen =
        currentAbschnitte[itemIndexAbschnitt].personen ?? [];
      const updatedPersonen = [...currentPersonen];
      updatedPersonen[nextItemBeweis] =
        reuseOption === "new"
          ? {
              personAuswahl: "anotherPerson",
              anrede: "",
              title: "",
              vorname: "",
              nachname: "",
              strasse: "",
              hausnummer: "",
              plz: "",
              ort: "",
              land: "",
              telefonnummer: "",
              email: "",
            }
          : {
              personAuswahl: reuseOption,
            };

      currentAbschnitte[itemIndexAbschnitt] = {
        ...currentAbschnitte[itemIndexAbschnitt],
        personen: updatedPersonen,
      };

      const updatedUserData = merge({}, flowSession.data, {
        abschnitte: currentAbschnitte,
      });

      updateSession(flowSession, updatedUserData);

      const headers = await commitSession(flowSession);
      const redirectUrl =
        reuseOption === "new"
          ? `${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/${BASE_URL_PAGE_ADD_NEW_DOCUMENT}`
          : `${BASE_URL_PAGE_UEBERSICHT}${itemIndexAbschnitt}`;

      return redirectDocument(redirectUrl, { headers });
    }
  }
};
