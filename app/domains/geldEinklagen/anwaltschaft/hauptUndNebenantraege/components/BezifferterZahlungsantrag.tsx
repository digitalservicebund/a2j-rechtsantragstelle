import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { Badge } from "~/components/content/Badge";
import { NebenantragItem } from "./NebenantragItem";
import { getBezifferterAntragText } from "./nebenantragContent";
import { ArrayItemCard } from "~/components/content/arrayItemList/ArrayItemCard";
import { DeleteButton } from "~/components/common/DeleteButton";
import { InlineNotice } from "~/components/content/InlineNotice";
import { Icon } from "~/components/common/Icon";

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
          description={
            <>
              <InlineNotice
                title={
                  "Achtung: Löschen hat Auswirkungen auf bereits erstellte Tatsachenvorträge"
                }
                tagName={"div"}
                look={"warning"}
                content={`<p>Sie haben mindestens einen Tatsachenvortrag erstellt, der mit dem allgemeinen Zahlungsantrag ${itemIndex + 1} oder 
                möglichen dazugehörigen Nebenanträgen/Feststellungsantrag auf Annahmeverzug verknüpft ist. Wenn Sie den allgemeinen Zahlungsantrag ${itemIndex + 1} löschen, werden auch damit verknüpfte Tatsachenvorträge gelöscht. Ohne Bezug wären diese unzulässig.</p><br />
<strong>Das können Sie tun:</strong><br />
<li><strong>Behalten und bearbeiten:</strong></li><br /><p>Falls Sie lediglich die Angaben für den allgemeinen Zahlungsantrag ${itemIndex + 1} ändern möchten, behalten und bearbeiten Sie diesen, anstatt ihn zu löschen. So bleiben Ihre bereits erstellten Tatsachenvorträge unverändert erhalten. Prüfen Sie bitte nach einer Bearbeitung dennoch die Vollständigkeit und Richtigkeit Ihrer dazugehörigen Tatsachenvorträge.</p><br />
<li><strong>Endgültig löschen:</strong></li><br /><p>Falls Sie den allgemeinen Zahlungsantrag ${itemIndex + 1} mitsamt den Tatsachenvorträgen wirklich löschen möchten, prüfen Sie bitte im Anschluss die Vollständigkeit und Richtigkeit Ihrer verbleibenden Tatsachenvorträge.</p>
</li>
            `}
              />
              <p className="kern-body">
                Der folgende Zahlungsantrag wird inklusive dazugehöriger
                Nebenanträge/Festellungsantrag auf Annahmeverzug entfernt:
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
      <NebenantragItem parentArrayItemIndex={itemIndex} userData={userData} />
    </ArrayItemCard>
  );
};
