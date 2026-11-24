import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { useEffect } from "react";
import { translations } from "~/services/translations/translations";
import {
  getNebenantragItemText,
  nebenantragArtLabels,
} from "../hauptUndNebenantraegeContent";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import {
  ANTRAG_DELETION_URL_ENDPOINT,
  getAntragDeletionDialogProps,
} from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { DeletionDialog } from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import { applyStringReplacement } from "~/util/applyStringReplacement";

const BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege";

type UnbezifferteSchmerzensgeldNebenantragItemProps = {
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly parentArrayItemIndex: number;
};

const MAX_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAG_ITEMS = 6;

const nebenantragArtDeleteDialogLabels = {
  ...nebenantragArtLabels,
  vorgerichtlicheAnwaltskosten: "Vorgerichtliche Anwaltskosten",
};

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
    ANTRAG_DELETION_URL_ENDPOINT,
  );

  return (
    <NestedArrayItemList
      heading={translations.geldEinklagenAnwaltschaft.nebenantrag.de}
      headingId={`schmerzensgeld-nebenantrag-heading-${parentArrayItemIndex}`}
      headingSuffix=" - Optional"
      items={items.map((entry, index) => {
        const itemBetrag = entry.schmerzengeldNebenantragBetrag
          ? `, ${entry.schmerzengeldNebenantragBetrag} ${translations.currency.euro.de}`
          : "";
        return {
          key: `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${index}`,
          id: `schmerzensgeld-nebenantrag-${parentArrayItemIndex}-${index}`,
          content: (
            <span className="kern-body">
              {getNebenantragItemText({
                item: entry,
                userData,
                schmerzengeldantragIndex: parentArrayItemIndex,
              })}
            </span>
          ),
          editButton: {
            href: `${BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${parentArrayItemIndex}/nebenantraege/${index}/daten`,
            ariaLabel: `Nebenantrag ${index + 1} bearbeiten`,
            onClick: onEditUnbezifferteSchmerzensgeldNebenantrag(index),
          },
          deleteButton: {
            onDelete: () => deleteUnbezifferteSchmerzensgeldNebenantrag(index),
            title:
              translations.geldEinklagenAnwaltschaft.nebenatragDeleteButton.de,
            ariaLabel: `Nebenantrag ${index + 1} löschen`,
            description: (
              <DeletionDialog
                {...getAntragDeletionDialogProps({
                  antrag: entry,
                  userData,
                  itemLabel: `${translations.geldEinklagenAnwaltschaft.nebenantrag.de} - ${nebenantragArtDeleteDialogLabels[entry.schmerzengeldNebenantragArt]}${itemBetrag}`,
                  description:
                    translations.geldEinklagenAnwaltschaft
                      .nebenantragInlineNoticeAntragToDelete.de,
                  warningTexts: {
                    auswirkungenText: applyStringReplacement(
                      translations.geldEinklagenAnwaltschaft
                        .nebenantragDeletionAuswirkungen.de,
                      { nebenantragType: "Nebenantrag" },
                    ),
                    keepAndEditText: applyStringReplacement(
                      translations.geldEinklagenAnwaltschaft
                        .keepAndEditNebenantrag.de,
                      { nebenantragType: "Nebenantrag" },
                    ),
                    deletePermanentlyText: applyStringReplacement(
                      translations.geldEinklagenAnwaltschaft
                        .deleteNebenantragPermanently.de,
                      { nebenantragType: "Nebenantrag" },
                    ),
                  },
                })}
              />
            ),
          },
        };
      })}
      addLinks={
        items.length < MAX_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAG_ITEMS
          ? [
              {
                href: `${BASE_URL_UNBEZIFFERTE_SCHMERZENSGELD_UND_NEBENANTRAEGE}/${parentArrayItemIndex}/nebenantraege/${items.length}/daten`,
                onClick: onEditUnbezifferteSchmerzensgeldNebenantrag(
                  items.length,
                ),
                label:
                  translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de,
              },
            ]
          : undefined
      }
    />
  );
};
