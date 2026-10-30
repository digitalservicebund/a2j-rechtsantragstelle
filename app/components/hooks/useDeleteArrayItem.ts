import { useRevalidator, useRouteLoaderData } from "react-router";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

/**
 * Deletes a given array item from the userData
 * @param arrayName Name of the array (with hashes), in format "arrayName" or "arrayName#subArrayName" for nested arrays
 * @param arrayUrl URL of where the item resides, i.e. /root/parentPage/arrayName (without hashes)
 * @param focusFunction Optional function to focus on a specific item after deletion
 */
export const useDeleteArrayItem = (
  arrayName: string,
  arrayUrl: string,
  focusFunction?: (itemIndex: number) => void,
) => {
  const csrf = useRouteLoaderData<RootLoader>("root")?.csrf ?? "";
  const revalidator = useRevalidator();

  const deleteArrayItemFromFormData = async (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => {
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
    focusFunction?.(itemIndex);
  };

  return (index: number) => deleteArrayItemFromFormData(arrayUrl, index);
};
