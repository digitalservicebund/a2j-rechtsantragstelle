import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useEffect } from "react";
import { translations } from "~/services/translations/translations";

import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import type { Nebenantrag } from "../hauptUndNebenantraegeSchemas";
import {
  getAlphabeticalEnumeration,
  getNebenantragItemText,
  nebenantragArtLabels,
} from "../hauptUndNebenantraegeContent";

const BASE_URL_NEBENANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege";

type BezifferterZahlungsUndNebenantragItemProps = {
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly parentArrayItemIndex: number;
};

const MAX_NEBENANTRAG_ITEMS = 6;

export const BezifferterZahlungsUndNebenantragItem = ({
  userData,
  parentArrayItemIndex,
}: BezifferterZahlungsUndNebenantragItemProps) => {
  const additionalFocusStorageKey = `focus-nebenantrag-${parentArrayItemIndex}`;

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(additionalFocusStorageKey);

      if (itemIndex === null) return;

      const element = document.getElementById(
        `nebenantrag-${parentArrayItemIndex}-${itemIndex}`,
      );

      if (element) {
        element.focus();
        sessionStorage.removeItem(additionalFocusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, [additionalFocusStorageKey, parentArrayItemIndex]);

  const onEditNebenantrag = (index: number) => () => {
    sessionStorage.setItem(additionalFocusStorageKey, String(index));
  };

  const items: Nebenantrag[] = (
    userData.hauptantrag?.[parentArrayItemIndex]?.nebenantraege ?? []
  ).map((item): Nebenantrag => {
    if ("annahmeverzugsFeststellung" in item) {
      return {
        ...item,
        type: "annahmeverzug",
      };
    }

    return {
      ...item,
      type: "nebenantrag",
    };
  });

  const nextNebenantragIndex = items.filter(
    (item) => item.type === "nebenantrag",
  ).length;
  const nextAnnahmeverzugIndex = items.filter(
    (item) => item.type === "annahmeverzug",
  ).length;

  const deleteNebenantrag = useDeleteArrayItem(
    "hauptantrag#nebenantraege",
    `/geld-einklagen/anwaltschaft/hauptantrag/${parentArrayItemIndex}`,
    (itemIndex) => {
      setTimeout(() => {
        const element =
          document.getElementById(
            `nebenantrag-${parentArrayItemIndex}-${itemIndex}`,
          ) ??
          document.getElementById(
            `nebenantrag-heading-${parentArrayItemIndex}`,
          );

        element?.focus();
      }, 100);
    },
  );

  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.nebenantragHeadline.de}
      headingId={`nebenantrag-heading-${parentArrayItemIndex}`}
      headingSuffix="Optional"
      subtitle={
        translations.geldEinklagenAnwaltschaft.nebenantragDescription.de
      }
      items={items.map((entry, index) => {
        const type = entry.type;
        const arrayIndex = index;
        const itemLabel =
          type === "nebenantrag"
            ? "Nebenantrag"
            : "Feststellungsantrag auf Annahmeverzug";

        return {
          key: `hauptantrag-${parentArrayItemIndex}-${type}-${index}`,
          id: `nebenantrag-${parentArrayItemIndex}-${index}`,
          content: (
            <>
              <span className="kern-body font-bold!">
                {getAlphabeticalEnumeration(index)}
              </span>

              <span className="kern-body max-w-[528px]">
                {getNebenantragItemText({
                  item: entry,
                  userData,
                  hauptantragIndex: parentArrayItemIndex,
                })}
              </span>
            </>
          ),
          editButton: {
            href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/${type}/${arrayIndex}/daten`,
            ariaLabel: `${itemLabel} ${index + 1} bearbeiten`,
            onClick: onEditNebenantrag(index),
          },
          deleteButton: {
            onDelete: () => deleteNebenantrag(arrayIndex),
            title:
              type === "nebenantrag"
                ? `${itemLabel} ${nebenantragArtLabels[entry.nebenantragArt]}, ${entry.nebenantragBetrag ? entry.nebenantragBetrag : ""}`
                : `${itemLabel}`,
            ariaLabel: `${itemLabel} ${index + 1} löschen`,
            description: (
              <>
                <InlineNotice
                  title={
                    translations.geldEinklagenAnwaltschaft
                      .nebenantragInlineNoticeTitle.de
                  }
                  tagName={"div"}
                  look={"warning"}
                  content={translations.geldEinklagenAnwaltschaft.nebenantragDeleteWarning.de.replace(
                    /\${itemLabel}/g,
                    itemLabel,
                  )}
                />
                <p className="kern-body">
                  {
                    translations.geldEinklagenAnwaltschaft
                      .nebenantragInlineNoticeAntragToDelete.de
                  }
                </p>
                <span className="flex flex-row items-center!">
                  <Icon name="money-range" className="mr-8!" />
                  <p className="kern-body! font-bold! text-xl!">
                    {type === "nebenantrag"
                      ? `${itemLabel} ${nebenantragArtLabels[entry.nebenantragArt]}, ${entry.nebenantragBetrag ? entry.nebenantragBetrag : ""}`
                      : itemLabel}
                  </p>
                </span>
              </>
            ),
          },
        };
      })}
      addLinks={[
        ...(nextNebenantragIndex < MAX_NEBENANTRAG_ITEMS
          ? [
              {
                href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/nebenantraege/${items.length}/daten`,
                label:
                  translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
              },
            ]
          : []),
        ...(nextAnnahmeverzugIndex === 0
          ? [
              {
                href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/annahmeverzug/${items.length}/daten`,
                label:
                  translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton
                    .de,
              },
            ]
          : []),
      ]}
    />
  );
};
