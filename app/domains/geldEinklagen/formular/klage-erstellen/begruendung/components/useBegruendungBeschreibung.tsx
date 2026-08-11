import { useRevalidator, useRouteLoaderData } from "react-router";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

const UPDATE_PERSONEN_URL_ENDPOINT =
  "/geld-einklagen/formular/action/update-abschnitten-personen-ids";

const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 10;

const focusOnBeweisTitle = (abschnittId: string) => {
  setTimeout(function () {
    const inputElement = document.querySelector<HTMLInputElement>(
      `#abschnitt-beweis-${abschnittId}`,
    );

    if (inputElement) {
      inputElement.focus();
    }
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

export const useBegruendungBeschreibung = () => {
  const csrf = useRouteLoaderData<RootLoader>("root")?.csrf ?? "";
  const jsEnabled = useJsAvailable();
  const revalidator = useRevalidator();
  return {
    onAbschnittDelete: async (pathnameArrayItem: string, itemIndex: number) => {
      const formData = new FormData();
      formData.append("pathnameArrayItem", pathnameArrayItem);
      formData.append("_jsEnabled", String(jsEnabled));
      formData.append("abschnitte", String(itemIndex));
      formData.append(CSRFKey, csrf);

      const response = await fetch(DELETE_URL_ENDPOINT, {
        method: "post",
        body: formData,
      });

      if (response.ok) {
        await revalidator.revalidate();
      }
    },
    onAbschnittDocumentDelete: async (
      pathnameArrayItem: string,
      abschnittIndex: number,
      documentIndex: number,
    ) => {
      const formData = new FormData();
      formData.append("pathnameArrayItem", pathnameArrayItem);
      formData.append("_jsEnabled", String(jsEnabled));
      formData.append("abschnitte#dokumenten", String(documentIndex));
      formData.append(CSRFKey, csrf);

      const response = await fetch(DELETE_URL_ENDPOINT, {
        method: "post",
        body: formData,
      });

      if (response.ok) {
        await fetch(UPDATE_PERSONEN_URL_ENDPOINT, {
          body: formData,
          method: "post",
        });

        await revalidator.revalidate();
        focusOnBeweisTitle(String(abschnittIndex));
      }
    },
    onAbschnittPersonDelete: async (
      pathnameArrayItem: string,
      abschnittIndex: number,
      personIndex: number,
    ) => {
      const formData = new FormData();
      formData.append("pathnameArrayItem", pathnameArrayItem);
      formData.append("_jsEnabled", String(jsEnabled));
      formData.append("abschnitte#personen", String(personIndex));
      formData.append(CSRFKey, csrf);

      const response = await fetch(DELETE_URL_ENDPOINT, {
        method: "post",
        body: formData,
      });

      if (response.ok) {
        await fetch(UPDATE_PERSONEN_URL_ENDPOINT, {
          body: formData,
          method: "post",
        });

        await revalidator.revalidate();
        focusOnBeweisTitle(String(abschnittIndex));
      }
    },
  };
};
