import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

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
  const deleteArrayItem = useDeleteArrayItem("sonstigeNebenUndProzessantraege");

  const onSonstigeNebenUndProzessantraegeDelete = async (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => {
    await deleteArrayItem(pathnameArrayItem, itemIndex);
    focusOnSonstigeNebenUndProzessantraege(itemIndex);
  };

  return { onSonstigeNebenUndProzessantraegeDelete };
};
