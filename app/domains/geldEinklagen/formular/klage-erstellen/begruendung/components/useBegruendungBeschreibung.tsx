import { useRevalidator, useRouteLoaderData } from "react-router";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

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
      itemIndex: number,
    ) => {
      const formData = new FormData();
      formData.append("pathnameArrayItem", pathnameArrayItem);
      formData.append("_jsEnabled", String(jsEnabled));
      formData.append("abschnitte#dokumenten", String(itemIndex));
      formData.append(CSRFKey, csrf);

      const response = await fetch(DELETE_URL_ENDPOINT, {
        method: "post",
        body: formData,
      });

      if (response.ok) {
        await revalidator.revalidate();
      }
    },
  };
};
