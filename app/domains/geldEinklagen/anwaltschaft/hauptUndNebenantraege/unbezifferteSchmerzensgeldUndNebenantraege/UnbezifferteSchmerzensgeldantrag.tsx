import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { getUnbezifferterSchmerzensgeldantragText } from "../hauptUndNebenantraegeContent";
import { UnbezifferteSchmerzensgeldNebenantragItem } from "./UnbezifferteSchmerzensgeldNebenantragItem";

const BASE_URL_UNBEZIEFERTER_SCHMERZENSGELD_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege";

type UnbezifferteSchmerzensgeldantragProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["schmerzengeldantrag"]
  >[number];
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly onDelete: (itemIndex: number) => Promise<void>;
  readonly onEdit: (itemIndex: number) => void;
};

export const UnbezifferteSchmerzensgeldantrag = ({
  itemIndex,
  item,
  userData,
  onDelete,
  onEdit,
}: UnbezifferteSchmerzensgeldantragProps) => {
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
      badge={item.internesSchlagwortFordureung ?? ""}
      editButton={{
        href: `${BASE_URL_UNBEZIEFERTER_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${itemIndex}/daten`,
        ariaLabel: `Schmerzensgeldantrag ${itemIndex + 1} bearbeiten`,
        onClick: () => onEdit(itemIndex),
      }}
      deleteButton={
        <DeleteButton
          label={`Schmerzensgeldantrag ${itemIndex + 1} und Nebenanträge löschen`}
          title={`Schmerzensgeldantrag ${itemIndex + 1} löschen?`}
          description={
            <>
              <InlineNotice
                title={
                  translations.geldEinklagenAnwaltschaft
                    .schmerzengeldantragInlineNoticeTitle.de
                }
                tagName={"div"}
                look={"warning"}
                content={translations.geldEinklagenAnwaltschaft.schmerzengeldantragDeleteWarning.de.replace(
                  /\$\{itemIndex \+ 1\}/g,
                  `${itemIndex + 1}`,
                )}
              />
              <p className="kern-body">
                {
                  translations.geldEinklagenAnwaltschaft
                    .schmerzengeldantragItemsToDelete.de
                }
              </p>
              <span className="flex flex-row items-center!">
                <Icon name="money-range" className="mr-8!" />
                <p className="kern-body! font-bold! text-xl!">
                  {`Schmerzensgeldantrag ${itemIndex + 1}`}
                  {item.internesSchlagwortFordureung
                    ? `${item.internesSchlagwortFordureung},`
                    : ""}
                  {item.mindestBetrag ? `${item.mindestBetrag} Euro` : ""}
                </p>
              </span>
            </>
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
