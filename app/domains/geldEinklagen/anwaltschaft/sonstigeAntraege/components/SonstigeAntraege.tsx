import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BASE_URL_SONSTIGE_ANTRAEGE } from "./SonstigeAntraegeUebersicht";
import { DeleteButton } from "~/components/common/DeleteButton";
import { translations } from "~/services/translations/translations";
import { useEffect } from "react";

type SonstigeAntraegeProps = {
  readonly itemIndex: number;
  readonly antragNumber: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["sonstigeAntraege"]
  >[number];
  readonly onDelete: (itemIndex: number) => Promise<void>;
};

const SonstigeAntraege = ({
  itemIndex,
  antragNumber,
  item,
  onDelete,
}: SonstigeAntraegeProps) => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem("focusSonstigeAntraege");

      if (itemIndex === null) return;

      const element = document.getElementById(`sonstigeAntraege-${itemIndex}`);

      if (element) {
        element.focus();

        sessionStorage.removeItem("focusSonstigeAntraege");
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <ArrayItemCard
      id={`sonstigeAntraege-${itemIndex}`}
      badge={item.internesSchlagwort}
      content={
        <span className="max-w-[632px] text-ellipsis overflow-hidden whitespace-nowrap">
          {item.antrag}
        </span>
      }
      heading={{
        text: `${translations.geldEinklagenAnwaltschaft.sonstigerAntragArrayItemTitle.de} ${antragNumber}`,
        id: `sonstigeAntrag-${itemIndex}`,
      }}
      editButton={{
        id: `edit-sonstigeAntraege-${itemIndex}`,
        ariaLabel: `${translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de} ${antragNumber} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${BASE_URL_SONSTIGE_ANTRAEGE}/${itemIndex}/daten`,
        onClick: () => {
          sessionStorage.setItem("focusSonstigeAntraege", String(itemIndex));
        },
      }}
      deleteButton={
        <DeleteButton
          label={
            translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete
              .de
          }
          title={`${
            translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete
              .de
          }${"?"}`}
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

export default SonstigeAntraege;
