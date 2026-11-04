import { NestedArrayItemList } from "~/components/content/arrayItemList/NestedArrayItemList";
import { translations } from "~/services/translations/translations";
import {
  getAlphabeticalEnumeration,
  getNebenantragItemText,
  nebenantragArtLabels,
} from "./nebenantragContent";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { useDeleteArrayItem } from "~/components/hooks/useDeleteArrayItem";
import { formatEuro } from "../utils";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";
import type { Nebenantrag } from "../hauptUndNebenantraegeSchemas";

const BASE_URL_NEBENANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege";

type NebenantragItemProps = {
  readonly userData: GeldEinklagenAnwaltschaftUserData;
  readonly parentArrayItemIndex: number;
};

const MAX_NEBENANTRAG_ITEMS = 6;

export const NebenantragItem = ({
  userData,
  parentArrayItemIndex,
}: NebenantragItemProps) => {
  const items: Nebenantrag[] = (
    userData.hauptantrag?.[parentArrayItemIndex]?.nebenantrag ?? []
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
    "hauptantrag#nebenantrag",
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
      items={items.map((entry, index) => {
        const type = entry.type;
        const arrayIndex = index;
        const itemLabel =
          type === "nebenantrag"
            ? "Nebenantrag"
            : "Feststellungsantrag auf Annahmeverzug";

        return {
          key: `hauptantrag-${parentArrayItemIndex}-${type}-${index}`,
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
          },
          deleteButton: {
            onDelete: () => deleteNebenantrag(arrayIndex),
            title:
              type === "nebenantrag"
                ? `${itemLabel} ${nebenantragArtLabels[entry.nebenantragArt]}, ${entry.nebenantragBetrag ? formatEuro(entry.nebenantragBetrag) : ""}`
                : `${itemLabel}`,
            ariaLabel: `${itemLabel} ${index + 1} löschen`,
            description: (
              <>
                <InlineNotice
                  title={
                    "Achtung: Löschen hat Auswirkungen auf bereits erstellten Tatsachenvortrag"
                  }
                  tagName={"div"}
                  look={"warning"}
                  content={`<p>Sie haben bereits einen Tatsachenvortrag erstellt, der mit diesem ${itemLabel} verknüpft ist. Wenn Sie diesen Antrag löschen, wird auch der damit verknüpfte Tatsachenvortrag gelöscht. Ohne Bezug wäre dieser unzulässig.</p><br />
<strong>Das können Sie tun:</strong><br />
<li><strong>Behalten und bearbeiten:</strong></li><br /><p>Falls Sie lediglich die Angaben für diesen ${itemLabel} ändern möchten, behalten und bearbeiten Sie diesen, anstatt ihn zu löschen. So bleibt Ihr bereits erstellter Tatsachenvortrag unverändert erhalten. Prüfen Sie bitte nach einer Bearbeitung dennoch die Vollständigkeit und Richtigkeit Ihres dazugehörigen Tatsachenvortrags.</p><br />
<li><strong>Endgültig löschen:</strong></li><br /><p>Falls Sie den ${itemLabel} mitsamt dem Tatsachenvortrag wirklich löschen möchten, prüfen Sie bitte im Anschluss die Vollständigkeit und Richtigkeit Ihrer verbleibenden Tatsachenvorträge.</p><br />`}
                />
                <p className="kern-body">Der folgende Antrag wird entfernt:</p>
                <span className="flex flex-row items-center!">
                  <Icon name="money-range" className="mr-8!" />
                  <p className="kern-body! font-bold! text-xl!">
                    {type === "nebenantrag"
                      ? `${itemLabel} ${nebenantragArtLabels[entry.nebenantragArt]}, ${entry.nebenantragBetrag ? formatEuro(entry.nebenantragBetrag) : ""}`
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
                href: `${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/nebenantrag/${items.length}/daten`,
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
