import { Icon } from "~/components/common/Icon";
import { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { Badge } from "~/components/content/Badge";
import Button from "~/components/common/Button";
import { NebenantragItem } from "./NebenantragItem";

export const BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag";

type BezifferterZahlungsantragProps = {
  readonly itemIndex: number;
  readonly index: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["hauptantrag"]
  >[number];
};

export const BezifferterZahlungsantrag = ({
  itemIndex,
  item,
  index,
}: BezifferterZahlungsantragProps) => {
  return (
    <div
      id={`zahlungsAntrag-${itemIndex}`}
      tabIndex={-1}
      className="kern-summary pb-24"
    >
      <h2 className="kern-body kern-body--large kern-body--bold p-0!">
        Bezifferter Zahlungsantrag {itemIndex + 1}
      </h2>
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)] py-kern-space-default mt-18">
        <div className="flex flex-col gap-kern-space-large">
          {/* {item.internesSchlagwortFordureung && ( */}
          <Badge className="w-full max-w-[450px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap py-kern-space-small! px-kern-space-default! bg-kern-neutral-025!">
            {/* {item.internesSchlagwortFordureung} */}
            item.internesSchlagwortFordureung
          </Badge>
          {/* )} */}
          <div className="flex justify-between items-center">
            <span className="kern-body max-w-[632px]">
              Die Beklagten zu 1) und zu 2) werden als Gesamtschuldner
              verurteilt, an die Klagende zu 2) 1.200,00 Euro nebst Zinsen in
              Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz p.a.
              seit Rechtshängigkeit zu zahlen.
            </span>
            <Button
              look="secondary"
              iconLeft={
                <Icon
                  name="edit"
                  className="size-kern-dimension-default text-kern-action-default"
                />
              }
              aria-label={`Zahlungsantrag ${itemIndex + 1} bearbeiten`}
              href={`${BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE}/${itemIndex}/daten`}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
          </div>
          <NebenantragItem parentArrayItemIndex={itemIndex} nebenantrag={item.nebenantrag} />
          <div className="flex justify-end mt-24">
            <Button
              type="button"
              aria-haspopup="dialog"
              look="secondary"
              className="border-0!"
              textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
              iconLeft={
                <Icon name="trash" className="fill-kern-feedback-danger!" />
              }
              onClick={() => {}}
              aria-label={`Zahlungsantrag ${itemIndex + 1} und Nebenanträge löschen`}
            >
              Zahlungsantrag {itemIndex + 1} und Nebenanträge löschen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
