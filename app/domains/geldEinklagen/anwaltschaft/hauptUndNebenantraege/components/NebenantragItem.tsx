import { translations } from "~/services/translations/translations";
import {
  getAlphabeticalEnumeration,
  getNebenantragItemText,
} from "./nebenantragContent";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";

const BASE_URL_NEBENANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege";

type Hauptantrag = NonNullable<
  GeldEinklagenAnwaltschaftUserData["hauptantrag"]
>[number];

type Nebenantrag = {
  item: NonNullable<Hauptantrag["nebenantrag"]>[number];
  index: number;
  type: "nebenantrag";
  arrayIndex: number;
};

type Annahmeverzug = {
  item: NonNullable<Hauptantrag["annahmeverzug"]>[number];
  index: number;
  type: "annahmeverzug";
  arrayIndex: number;
};

type NebenantragItemData = Nebenantrag | Annahmeverzug;

type NebenantragItemProps = {
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly nebenantrag: Hauptantrag["nebenantrag"];
  readonly annahmeverzug: Hauptantrag["annahmeverzug"];
  readonly parentArrayItemIndex: number;
  readonly onDelete: (itemIndex: number) => Promise<void>;
};

const MAX_NEBENANTRAG_UND_ANNAHMENVERZUG_ITEMS = 7;

export const NebenantragItem = ({
  userData,
  nebenantrag,
  annahmeverzug,
  parentArrayItemIndex,
}: NebenantragItemProps) => {
  const nebenantragItems: Nebenantrag[] = (nebenantrag ?? []).map(
    (item, index) => ({
      item,
      index,
      arrayIndex: index,
      type: "nebenantrag",
    }),
  );

  const annahmeverzugItems: Annahmeverzug[] = (annahmeverzug ?? []).map(
    (item, index) => ({
      item,
      index: (nebenantrag ?? []).length + index,
      arrayIndex: index,
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

  const deleteNebenantrag = useDeleteArrayItem(
    "hauptantrag#nebenantrag",
    `/geld-einklagen/anwaltschaft/hauptantrag/${parentArrayItemIndex}`,
  );

  const deleteAnnahmeverzug = useDeleteArrayItem(
    "hauptantrag#annahmeverzug",
    `/geld-einklagen/anwaltschaft/hauptantrag/${parentArrayItemIndex}`,
  );

  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.nebenantragHeadline.de}
      headingId={`nebenantrag-heading-${parentArrayItemIndex}`}
      headingSuffix="Optional"
      subtitle={
        translations.geldEinklagenAnwaltschaft.nebenantragDescription.de
      }
      items={items.map((entry) => {
        const { index, type, arrayIndex } = entry;

        const deleteItem =
          type === "nebenantrag" ? deleteNebenantrag : deleteAnnahmeverzug;

        const itemLabel =
          type === "nebenantrag" ? "Nebenantrag" : "Annahmeverzug";

        return {
          key: `hauptantrag-${parentArrayItemIndex}-${type}-${index}`,
          content: (
            <>
              <span className="kern-body font-bold!">
                {getAlphabeticalEnumeration(index)}
              </span>

              <span className="kern-body max-w-[528px]">
                {getNebenantragItemText({
                  ...entry,
                  userData,
                  hauptantragIndex: parentArrayItemIndex,
                })}
              </span>
            </>
          ),
          editButton: {
            href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/${type}/${arrayIndex}/daten`,
            ariaLabel: `${itemLabel} ${index + 1} bearbeiten`,
          },
          deleteButton: {
            onDelete: () => deleteItem(arrayIndex),
            title: `${itemLabel} ${index + 1} löschen`,
            ariaLabel: `${itemLabel} ${index + 1} löschen`,
            description: `Möchten Sie diesen ${itemLabel.toLowerCase()} wirklich löschen?`,
          },
        };
      })}
      addLinks={[
        {
          href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/nebenantrag/${nextNebenantragIndex}/daten`,
          label: translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
          disabled: shouldDisableAddButton,
        },
        {
          href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/annahmeverzug/${nextAnnahmeverzugIndex}/daten`,
          label:
            translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton.de,
          disabled: shouldDisableAddButton,
        },
      ]}
    />
  );
};
