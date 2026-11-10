import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useEffect } from "react";
import { translations } from "~/services/translations/translations";
import {
  getAlphabeticalEnumeration,
  getNebenantragItemText,
} from "../hauptUndNebenantraegeContent";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

const BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege";

type UnbezifferteSchmerzensgeldNebenantragItemProps = {
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly parentArrayItemIndex: number;
};

const MAX_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAG_ITEMS = 6;

export const UnbezifferteSchmerzensgeldNebenantragItem = ({
  userData,
  parentArrayItemIndex,
}: UnbezifferteSchmerzensgeldNebenantragItemProps) => {
  const additionalFocusStorageKey = `focus-schmerzensgeld-nebenantrag-${parentArrayItemIndex}`;

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const itemIndex = sessionStorage.getItem(additionalFocusStorageKey);

      if (itemIndex === null) return;

      const element = document.getElementById(
        `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${itemIndex}`,
      );

      if (element) {
        element.focus();
        sessionStorage.removeItem(additionalFocusStorageKey);
      }
    }, 0);

    return () => clearTimeout(focusTimer);
  }, [additionalFocusStorageKey, parentArrayItemIndex]);

  const onEditUnbezifferteSchmerzensgeldNebenantrag = (index: number) => () => {
    sessionStorage.setItem(additionalFocusStorageKey, String(index));
  };

  const items =
    userData.schmerzengeldantrag?.[parentArrayItemIndex]?.nebenantraege ?? [];

  const deleteUnbezifferteSchmerzensgeldNebenantrag = useDeleteArrayItem(
    "schmerzengeldantrag#nebenantraege",
    `/geld-einklagen/anwaltschaft/schmerzengeldantrag/${parentArrayItemIndex}`,
    (itemIndex) => {
      setTimeout(() => {
        const element =
          document.getElementById(
            `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${itemIndex}`,
          ) ??
          document.getElementById(
            `schmerzensgeld-nebenantrag-heading-${parentArrayItemIndex}`,
          );
        element?.focus();
      }, 100);
    },
  );

  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.nebenantrag.de}
      headingId={`schmerzensgeld-nebenantrag-heading-${parentArrayItemIndex}`}
      headingSuffix=" - Optional"
      items={items.map((entry, index) => {
        return {
          key: `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${index}`,
          id: `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${index}`,
          content: (
            <>
              <span className="kern-body font-bold!">
                {getAlphabeticalEnumeration(index)}
              </span>

              <span className="kern-body max-w-[528px]">
                {getNebenantragItemText({
                  item: entry,
                  userData,
                  schmerzengeldantragIndex: parentArrayItemIndex,
                })}
              </span>
            </>
          ),
          editButton: {
            href: `${BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${parentArrayItemIndex}/nebenantraege/${index}/daten`,
            ariaLabel: `Nebenantrag ${index + 1} bearbeiten`,
            onClick: onEditUnbezifferteSchmerzensgeldNebenantrag(index),
          },
          deleteButton: {
            onDelete: () => deleteUnbezifferteSchmerzensgeldNebenantrag(index),
            title: `${entry.schmerzengeldNebenantragZinsmethode ? entry.schmerzengeldNebenantragZinsmethode : ""}, ${entry.schmerzengeldNebenantragBetrag ? entry.schmerzengeldNebenantragBetrag : ""}`,
            ariaLabel: `Schmerzensgeldantrag ${index + 1} löschen`,
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
                    "Schmerzensgeldantrag",
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
                    {`${entry.schmerzengeldNebenantragZinsmethode ? entry.schmerzengeldNebenantragZinsmethode : ""}, ${entry.schmerzengeldNebenantragBetrag ? entry.schmerzengeldNebenantragBetrag : ""}`}
                  </p>
                </span>
              </>
            ),
          },
        };
      })}
      addLinks={
        items.length < MAX_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAG_ITEMS
          ? [
              {
                href: `${BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${parentArrayItemIndex}/nebenantraege/${items.length}/daten`,
                label:
                  translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
              },
            ]
          : undefined
      }
    />
  );
};
