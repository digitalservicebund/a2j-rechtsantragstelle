import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE } from "./SonstigeNebenUndProzessantraegeUebersicht";
import { DeleteButton } from "~/components/common/DeleteButton";
import { translations } from "~/services/translations/translations";
import { useEffect } from "react";

type SonstigeNebenUndProzessantraegeProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["sonstigeNebenUndProzessantraege"]
  >[number];
  readonly onDelete: (itemIndex: number) => Promise<void>;
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
    <ArrayItemCard
      id={`sonstigeNebenUndProzessantraege-${itemIndex}`}
      badge={item.internesSchlagwort}
      content={<span className="max-w-[632px]">{item.antrag}</span>}
      editButton={{
        id: `edit-sonstigeNebenUndProzessantraege-${itemIndex}`,
        ariaLabel: `${translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de} ${itemIndex + 1} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE}/${itemIndex}/daten`,
        onClick: () => {
          sessionStorage.setItem(
            "focusSonstigeNebenUndProzessantraege",
            String(itemIndex),
          );
        },
      }}
      deleteButton={
        <DeleteButton
          label={
            translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete
              .de
          }
          title={
            translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete
              .de
          }
          onDelete={() => onDelete(itemIndex)}
          description={
            <div className="flex flex-col gap-kern-space-small">
              <p>{translations.deleteDialog.description.de}</p>
              {item.internesSchlagwort && (
                <p className="font-bold">{item.internesSchlagwort}</p>
              )}
              <p className="font-normal">{item.antrag}</p>
            </div>
          }
        />
      }
    />
  );
};

export default SonstigeNebenUndProzessantraege;
