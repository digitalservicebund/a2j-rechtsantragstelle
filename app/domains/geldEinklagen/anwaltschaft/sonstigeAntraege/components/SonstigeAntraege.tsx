import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BASE_URL_SONSTIGE_ANTRAEGE } from "./SonstigeAntraegeUebersicht";
import { DeleteButton } from "~/components/common/DeleteButton";
import { translations } from "~/services/translations/translations";
import { useFormFlow } from "~/components/hooks/formFlowContext";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import { getAntragDeletionDialogProps } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";

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
  const { userData } = useFormFlow();
  const deletionTitle = `${
    translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de
  } ${antragNumber} ${translations.arraySummary.arrayDeleteButtonLabel.de.toLocaleLowerCase()}`;
  return (
    <ArrayItemCard
      id={`sonstigeAntraege-${itemIndex}`}
      badge={item.internesSchlagwort}
      content={<p className="max-w-632">{item.antrag}</p>}
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
          label={deletionTitle}
          title={`${deletionTitle}?`}
          description={
            <DeletionDialog
              {...getAntragDeletionDialogProps({
                antrag: item,
                userData,
                itemLabel: `${translations.geldEinklagenAnwaltschaft.soenstigeProzessantragItem.de} ${antragNumber}${item.internesSchlagwort ? ` (${item.internesSchlagwort})` : ""}`,
                warningTexts: {
                  auswirkungenText:
                    translations.geldEinklagenAnwaltschaft
                      .antragDeletionAuswirkungen.de,
                  keepAndEditText:
                    translations.geldEinklagenAnwaltschaft.keepAndEditAntrag.de,
                  deletePermanentlyText:
                    translations.geldEinklagenAnwaltschaft
                      .deleteAntragPermanently.de,
                },
              })}
            />
          }
          onDelete={() => onDelete(itemIndex)}
        />
      }
    />
  );
};

export default SonstigeAntraege;
