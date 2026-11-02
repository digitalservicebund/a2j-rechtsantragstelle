import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { Badge } from "~/components/content/Badge";
import { NebenantragItem } from "./NebenantragItem";
import { getBezifferterAntragText } from "./nebenantragContent";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";

const BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag";

type BezifferterZahlungsantragProps = {
  readonly itemIndex: number;
  readonly index: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["hauptantrag"]
  >[number];
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly onDelete: (itemIndex: number) => Promise<void>;
};

export const BezifferterZahlungsantrag = ({
  itemIndex,
  item,
  userData,
  onDelete,
}: BezifferterZahlungsantragProps) => {
  return (
    <ArrayItemCard
      id={`zahlungsAntrag-${itemIndex}`}
      content={
        <div className="flex flex-col gap-kern-space-large min-w-0 flex-1">
          {item.internesSchlagwortFordureung && (
            <Badge className="w-full max-w-[450px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap py-kern-space-small! px-kern-space-default! bg-kern-neutral-025!">
              {item.internesSchlagwortFordureung}
            </Badge>
          )}

          <span className="kern-body">
            {getBezifferterAntragText({
              userData,
              hauptantragIndex: itemIndex,
            })}
          </span>
        </div>
      }
      editButton={{
        href: `${BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE}/${itemIndex}/daten`,
        ariaLabel: `Zahlungsantrag ${itemIndex + 1} bearbeiten`,
      }}
      deleteButton={
        <DeleteButton
          label={`Zahlungsantrag ${itemIndex + 1} und Nebenanträge löschen`}
          title={`Zahlungsantrag ${itemIndex + 1} löschen`}
          description="Möchten Sie diesen Zahlungsantrag einschließlich aller zugehörigen Nebenanträge wirklich löschen?"
          onDelete={() => onDelete(itemIndex)}
        />
      }
    >
      <NebenantragItem
        parentArrayItemIndex={itemIndex}
        nebenantrag={item.nebenantrag}
        annahmeverzug={item.annahmeverzug}
        userData={userData}
        onDelete={onDelete}
      />
    </ArrayItemCard>
  );
};
