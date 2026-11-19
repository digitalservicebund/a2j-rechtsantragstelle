import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BASE_URL_SONSTIGE_ANTRAEGE } from "./SonstigeAntraegeUebersicht";
import { DeleteButton } from "~/components/common/DeleteButton";
import { translations } from "~/services/translations/translations";

type SonstigeAntraegeProps = {
  readonly itemIndex: number;
  readonly antragNumber: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["sonstigeAntraege"]
  >[number];
  readonly onDelete: (itemIndex: number) => Promise<void>;
  readonly onEdit: (itemIndex: number) => void;
};

const SonstigeAntraege = ({
  itemIndex,
  antragNumber,
  item,
  onDelete,
  onEdit,
}: SonstigeAntraegeProps) => {
  return (
    <ArrayItemCard
      id={`sonstigeAntraege-${itemIndex}`}
      badge={item.internesSchlagwort}
      content={<p className="max-w-[632px]">{item.antrag}</p>}
      editButton={{
        id: `edit-sonstigeAntraege-${itemIndex}`,
        ariaLabel: `${translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de} ${antragNumber} ${translations.arraySummary.arrayEditButtonLabel.de}`,
        href: `${BASE_URL_SONSTIGE_ANTRAEGE}/${itemIndex}/daten`,
        onClick: () => {
          onEdit(itemIndex);
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
