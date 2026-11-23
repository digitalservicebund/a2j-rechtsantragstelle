import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getAntragDeletionDialogProps } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { getUnbezifferterSchmerzensgeldantragText } from "../hauptUndNebenantraegeContent";
import { UnbezifferteSchmerzensgeldNebenantragItem } from "./UnbezifferteSchmerzensgeldNebenantragItem";

const BASE_URL_UNBEZIEFERTER_SCHMERZENSGELD_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege";

type UnbezifferteSchmerzensgeldantragProps = {
  readonly itemIndex: number;
  readonly antragNumber: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["schmerzengeldantrag"]
  >[number];
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly onDelete: (itemIndex: number) => Promise<void>;
  readonly onEdit: (itemIndex: number) => void;
};

export const UnbezifferteSchmerzensgeldantrag = ({
  itemIndex,
  antragNumber,
  item,
  userData,
  onDelete,
  onEdit,
}: UnbezifferteSchmerzensgeldantragProps) => {
  const replacements = { antragNumber: antragNumber.toString() };
  return (
    <ArrayItemCard
      id={`schmerzengeldantrag-${itemIndex}`}
      content={
        <div className="flex flex-col gap-kern-space-large min-w-0 flex-1">
          <span className="kern-body">
            {getUnbezifferterSchmerzensgeldantragText({
              userData,
              schmerzengeldantragIndex: itemIndex,
            })}
          </span>
        </div>
      }
      badge={item.internesSchlagwortForderung ?? ""}
      editButton={{
        href: `${BASE_URL_UNBEZIEFERTER_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${itemIndex}/daten`,
        ariaLabel: `Schmerzensgeldantrag ${antragNumber} bearbeiten`,
        onClick: () => onEdit(itemIndex),
      }}
      deleteButton={
        <DeleteButton
          label={`Schmerzensgeldantrag ${antragNumber}${(item.nebenantraege?.length ?? 0) > 0 ? " und Nebenanträge" : ""} löschen`}
          title={`Schmerzensgeldantrag ${antragNumber} löschen?`}
          description={
            <DeletionDialog
              {...getAntragDeletionDialogProps({
                antrag: item,
                userData,
                itemLabel: `${translations.geldEinklagenAnwaltschaft.schmerzengeldantragHeadline.de} ${antragNumber}${item.internesSchlagwortForderung ? ` (${item.internesSchlagwortForderung})` : ""}${item.mindestBetrag ? `, ${item.mindestBetrag} ${translations.currency.euro.de}` : ""}`,
                description:
                  translations.geldEinklagenAnwaltschaft
                    .schmerzensgeldantragItemsToDelete.de,
                warningTexts: {
                  auswirkungenText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .schmerzengeldantragDeleteWarning.de,
                    replacements,
                  ),
                  keepAndEditText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .keepAndEditSchmerzengeldantrag.de,
                    replacements,
                  ),
                  deletePermanentlyText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .deleteSchmerzengeldantragPermanently.de,
                    replacements,
                  ),
                },
              })}
            />
          }
          onDelete={() => onDelete(itemIndex)}
        />
      }
    >
      <UnbezifferteSchmerzensgeldNebenantragItem
        userData={userData}
        parentArrayItemIndex={itemIndex}
      />
    </ArrayItemCard>
  );
};
