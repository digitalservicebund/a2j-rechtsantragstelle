import { useRevalidator, useRouteLoaderData } from "react-router";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

export const useDeleteArrayItem = (arrayName: string) => {
  const csrf = useRouteLoaderData<RootLoader>("root")?.csrf ?? "";
  const revalidator = useRevalidator();

  return async (pathnameArrayItem: string, itemIndex: number) => {
    const formData = new FormData();
    formData.append("pathnameArrayItem", pathnameArrayItem);
    formData.append("_jsEnabled", "true");
    formData.append(arrayName, String(itemIndex));
    formData.append(CSRFKey, csrf);

    const response = await fetch(DELETE_URL_ENDPOINT, {
      method: "post",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Array item deletion failed (${response.status})`);
    }

    await revalidator.revalidate();
  };
};
