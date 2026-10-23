import { Icon } from "~/components/common/Icon";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { Badge } from "~/components/content/Badge";
import { BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE } from "./SonstigeNebenUndProzessantraegeUebersicht";
import { SonstigeNebenUndProzessantraegeDeleteButton } from "./SonstigeNebenUndProzessantraegeDeleteButton";
import { useEffect } from "react";

type SonstigeNebenUndProzessantraegeProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["sonstigeNebenUndProzessantraege"]
  >[number];
  readonly onDelete: (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => Promise<void>;
};

const SonstigeNebenUndProzessantraege = ({
  itemIndex,
  item,
  onDelete,
}: SonstigeNebenUndProzessantraegeProps) => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(
        "focusSonstigeNebenUndProzessantraege",
      );

      if (itemIndex === null) return;

      const element = document.getElementById(
        `sonstigeNebenUndProzessantraege-${itemIndex}`,
      );

      if (element) {
        element.focus();

        sessionStorage.removeItem("focusSonstigeNebenUndProzessantraege");
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <div
      id={`sonstigeNebenUndProzessantraege-${itemIndex}`}
      tabIndex={-1}
      className="kern-summary pb-24 focus:outline-none"
    >
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
        <div className="flex flex-col gap-kern-space-large">
          {item.internesSchlagwort && (
            <Badge className="w-full max-w-[450px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap py-kern-space-small! px-kern-space-default! border-2!">
              {item.internesSchlagwort}
            </Badge>
          )}
          <div className="flex flex-row justify-between items-center">
            <span className="max-w-[632px]">{item.antrag}</span>
            <a
              id={`edit-sonstigeNebenUndProzessantraege-${itemIndex}`}
              className="kern-link kern-link--default kern-link--bold p-0! no-underline! hover:underline!"
              href={`${BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE}/${itemIndex}/daten`}
              aria-label={`edit-sonstigeNebenUndProzessantraege-${itemIndex}`}
              onClick={() => {
                sessionStorage.setItem(
                  "focusSonstigeNebenUndProzessantraege",
                  String(itemIndex),
                );
              }}
            >
              <Icon name="edit" className="text-kern-action-default" />
            </a>
          </div>
          <div className="flex justify-end">
            <SonstigeNebenUndProzessantraegeDeleteButton
              itemIndex={itemIndex}
              onDelete={onDelete}
              antrag={item.antrag}
              internesSchlagwort={item.internesSchlagwort}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SonstigeNebenUndProzessantraege;
