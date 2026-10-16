import { useRevalidator, useRouteLoaderData } from "react-router";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

const MILLISECONDS_TIME_OUT_FOCUS_INPUT = 100;

const focusOnSonstigeNebenUndProzessantraege = (itemIndex: number) => {
  setTimeout(() => {
    let element = document.getElementById(
      `sonstigeNebenUndProzessantraege-${itemIndex}`,
    );
    element ??= document.getElementById(
      `sonstigeNebenUndProzessantraege-${itemIndex - 1}`,
    );
    element ??= document.querySelector<HTMLElement>(
      '[data-testid="add-sonstigeNebenUndProzessantraege"]',
    );
    element?.focus();
  }, MILLISECONDS_TIME_OUT_FOCUS_INPUT);
};

export const useSonstigeNebenUndProzessantraegeDelete = () => {
  const csrf = useRouteLoaderData<RootLoader>("root")?.csrf ?? "";
  const revalidator = useRevalidator();

  const onSonstigeNebenUndProzessantraegeDelete = async (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => {
    const formData = new FormData();

    formData.append("pathnameArrayItem", pathnameArrayItem);
    formData.append("_jsEnabled", "true");
    formData.append("sonstigeNebenUndProzessantraege", String(itemIndex));
    formData.append(CSRFKey, csrf);

    const response = await fetch(DELETE_URL_ENDPOINT, {
      method: "post",
      body: formData,
    });

    if (response.ok) {
      await revalidator.revalidate();
      focusOnSonstigeNebenUndProzessantraege(itemIndex);
    }
  };

  return { onSonstigeNebenUndProzessantraegeDelete };
};
