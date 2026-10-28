import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";
import { getNebenantragItemText } from "./nebenantragContent";
import { GeldEinklagenAnwaltschaftUserData } from "../../userData";

const BASE_URL_NEBENANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege";

type Hauptantrag = NonNullable<
  GeldEinklagenAnwaltschaftUserData["hauptantrag"]
>[number];

type Nebenantrag = {
  item: NonNullable<Hauptantrag["nebenantrag"]>[number];
  index: number;
  type: "nebenantrag";
};

type Annahmeverzug = {
  item: NonNullable<Hauptantrag["annahmeverzug"]>[number];
  index: number;
  type: "annahmeverzug";
};

type NebenantragItemData = Nebenantrag | Annahmeverzug;

type NebenantragItemProps = {
  readonly nebenantrag: Hauptantrag["nebenantrag"];
  readonly annahmeverzug: Hauptantrag["annahmeverzug"];
  readonly parentArrayItemIndex: number;
};

const MAX_NEBENANTRAG_UND_ANNAHMENVERZUG_ITEMS = 7;

export const NebenantragItem = ({
  parentArrayItemIndex,
  nebenantrag,
  annahmeverzug,
}: NebenantragItemProps) => {

  const nebenantragItems: Nebenantrag[] = (nebenantrag ?? []).map(
  (item, index) => ({
    item,
    index,
    type: "nebenantrag",
  }),
);

const annahmeverzugItems: Annahmeverzug[] = (annahmeverzug ?? []).map(
  (item, index) => ({
    item,
    index,
    type: "annahmeverzug",
  }),
);

const items: NebenantragItemData[] = [
  ...nebenantragItems,
  ...annahmeverzugItems,
];
 
  const nextNebenantragIndex = (nebenantrag ?? []).length;
  const nextAnnahmeverzugIndex = (annahmeverzug ?? []).length;

  const shouldDisableAddButton =
    items.length >= MAX_NEBENANTRAG_UND_ANNAHMENVERZUG_ITEMS;

  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex flex-col">
        <span className="kern-body kern-body--muted">
          <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
            {translations.geldEinklagenAnwaltschaft.nebenantragHeadline.de}
          </span>
          {""} - Optional
        </span>
        <span className="kern-body kern-body--muted">
          {translations.geldEinklagenAnwaltschaft.nebenantragDescription.de}
        </span>
      </div>

      {items.map((entry) => {
        const { index, type } = entry;
        return (
        <div
          key={`hauptantrag-${parentArrayItemIndex}-${type}-${index}`}
          className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
        >
          <div className="kern-body kern-body--default text-pretty flex flex-col">
            <span className="kern-body max-w-[528px]">
              {getNebenantragItemText(entry)}
            </span>
          </div>
          <div className="flex gap-24">
            <Button
              look="secondary"
              iconLeft={
                <Icon
                  name="edit"
                  className="size-kern-dimension-default text-kern-action-default"
                />
              }
              aria-label={`${type === "nebenantrag" ? "Nebenantrag" : "Annahmeverzug"} ${index + 1} bearbeiten`}
              href={`${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/${type}/${index}/daten`}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
            <Button
              look="secondary"
              iconLeft={
                <Icon
                  name="trash"
                  className="size-kern-dimension-default text-kern-feedback-danger"
                />
              }
              aria-label={`${type === "nebenantrag" ? "Nebenantrag" : "Annahmeverzug"} ${index + 1} löschen`}
              className="p-kern-space-small! min-h-0! border-kern-feedback-danger! size-kern-dimension-x-large"
            />
          </div>
        </div>
        );
      })}
      <div className="flex flex-row justify-start gap-kern-space-x-large pt-24">
        <Button
          href={`${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/nebenantrag/${nextNebenantragIndex}/daten`}
          aria-label={`Nebenantrag ${nextNebenantragIndex + 1} hinzufügen`}
          className="text-kern-action-default! flex items-center pt-24 no-underline!"
          aria-disabled={shouldDisableAddButton}
          disabled={shouldDisableAddButton}
          look="secondary"
          iconLeft={<Icon name="plus" className="fill-kern-action-default!" />}
        >
          {translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de}
        </Button>
        <Button
          href={`${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/annahmeverzug/${nextAnnahmeverzugIndex}/daten`}
          aria-label={`Annahmeverzug ${nextAnnahmeverzugIndex + 1} hinzufügen`}
          className="text-kern-action-default! flex items-center pt-24 no-underline!"
          aria-disabled={shouldDisableAddButton}
          disabled={shouldDisableAddButton}
          look="secondary"
          iconLeft={<Icon name="plus" className="fill-kern-action-default!" />}
        >
          {translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton.de}
        </Button>
      </div>
    </div>
  );
};
