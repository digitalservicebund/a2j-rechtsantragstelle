import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BezifferterZahlungsUndNebenantragItem } from "./BezifferterZahlungsUndNebenantragItem";
import { getBezifferterAntragText } from "../hauptUndNebenantraegeContent";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getAntragDeletionDialogProps } from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";

const BASE_URL_BEZIFFERTER_ZAHLUNGS_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag";

type BezifferterZahlungsantragProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["hauptantrag"]
  >[number];
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly onDelete: (itemIndex: number) => Promise<void>;
  readonly onEdit: (itemIndex: number) => void;
};

export const BezifferterZahlungsantrag = ({
  itemIndex,
  item,
  userData,
  onDelete,
  onEdit,
}: BezifferterZahlungsantragProps) => {
  const antragNumber = itemIndex + 1;
  const replacements = { antragNumber: antragNumber.toString() };
  return (
    <ArrayItemCard
      id={`bezifferterZahlungsAntrag-${itemIndex}`}
      content={
        <div className="flex flex-col gap-kern-space-large min-w-0 flex-1">
          <span className="kern-body">
            {getBezifferterAntragText({
              userData,
              hauptantragIndex: itemIndex,
            })}
          </span>
        </div>
      }
      badge={item.internesSchlagwortForderung}
      editButton={{
        href: `${BASE_URL_BEZIFFERTER_ZAHLUNGS_UND_NEBENANTRAEGE}/${itemIndex}/daten`,
        ariaLabel: `Zahlungsantrag ${itemIndex + 1} bearbeiten`,
        onClick: () => onEdit(itemIndex),
      }}
      deleteButton={
        <DeleteButton
          label={`Zahlungsantrag ${itemIndex + 1}${(item.nebenantraege?.length ?? 0) > 0 ? " und Nebenanträge" : ""} löschen`}
          title={`Zahlungsantrag ${itemIndex + 1} löschen`}
          description={
            <DeletionDialog
              {...getAntragDeletionDialogProps({
                antrag: item,
                userData,
                itemLabel: `${translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantrag.de} ${antragNumber}${item.internesSchlagwortForderung ? ` (${item.internesSchlagwortForderung})` : ""}, ${item.betragForderung} ${translations.currency.euro.de}`,
                warningTexts: {
                  auswirkungenText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .bezifferterZahlungsantragDeleteWarning.de,
                    replacements,
                  ),
                  keepAndEditText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .keepAndEditBezifferterZahlungsantrag.de,
                    replacements,
                  ),
                  deletePermanentlyText: applyStringReplacement(
                    translations.geldEinklagenAnwaltschaft
                      .deleteBezifferterZahlungsantragPermanently.de,
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
      <BezifferterZahlungsUndNebenantragItem
        parentArrayItemIndex={itemIndex}
        userData={userData}
      />
    </ArrayItemCard>
  );
};
