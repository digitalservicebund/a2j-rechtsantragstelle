import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BezifferterZahlungsUndNebenantragItem } from "./BezifferterZahlungsUndNebenantragItem";
import { getBezifferterAntragText } from "../hauptUndNebenantraegeContent";

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
      badge={item.internesSchlagwortFordureung}
      editButton={{
        href: `${BASE_URL_BEZIFFERTER_ZAHLUNGS_UND_NEBENANTRAEGE}/${itemIndex}/daten`,
        ariaLabel: `Zahlungsantrag ${itemIndex + 1} bearbeiten`,
        onClick: () => onEdit(itemIndex),
      }}
      deleteButton={
        <DeleteButton
          label={`Zahlungsantrag ${itemIndex + 1} und Nebenanträge löschen`}
          title={`Zahlungsantrag ${itemIndex + 1} löschen`}
          description={
            <>
              <InlineNotice
                title={
                  translations.geldEinklagenAnwaltschaft
                    .bezifferterZahlungsantragInlineNoticeTitle.de
                }
                tagName={"div"}
                look={"warning"}
                content={translations.geldEinklagenAnwaltschaft.bezifferterZahlungsantragDeleteWarning.de.replace(
                  /\$\{itemIndex \+ 1\}/g,
                  `${itemIndex + 1}`,
                )}
              />
              <p className="kern-body">
                {
                  translations.geldEinklagenAnwaltschaft
                    .bezifferterZahlungsantragItemsToDelete.de
                }
              </p>
              <span className="flex flex-row items-center!">
                <Icon name="money-range" className="mr-8!" />
                <p className="kern-body! font-bold! text-xl!">
                  {`Bezifferter Zahlungsantrag ${itemIndex + 1}`}{" "}
                  {item.internesSchlagwortFordureung
                    ? `${item.internesSchlagwortFordureung}`
                    : ""}
                  , {item.betragForderung ? `${item.betragForderung}` : ""}
                </p>
              </span>
            </>
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
