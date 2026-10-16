import { Icon } from "~/components/common/Icon";
import { Badge } from "~/components/content/Badge";
import { GeldEinklagenAnwaltschaftUserData } from "../userData";
import { BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE } from "./HauptUndNebenantraegeUebersicht";
import { DeleteButtonWithJavaScript } from "./HauptUndNebenantraegeDeleteButton";

type HauptUndNebenantraegeProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["sonstigeNebenUndProzessantraege"]
  >[number];
  readonly onDelete: (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => Promise<void>;
};
const HauptUndNebenantraege = ({
  itemIndex,
  item,
  onDelete,
}: HauptUndNebenantraegeProps) => {
  return (
    <>
      <div
        id={`sonstigeNebenUndProzessantraege-${itemIndex}`}
        tabIndex={-1}
        className="kern-summary pb-24"
      >
        <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
          <div className="flex flex-col gap-kern-space-large">
            {item.internesSchlagwort && (
              <Badge className="w-full max-w-[450px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap py-kern-space-small! px-kern-space-default! border-2!">
                {item.internesSchlagwort}
              </Badge>
            )}
            <div className="flex flex-row justify-between items-center">
              <span>{item.antrag}</span>
              <a
                id={`edit-sonstigeNebenUndProzessantraege-${itemIndex}`}
                href={`${BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE}/${itemIndex}/daten`}
                aria-label={`edit-sonstigeNebenUndProzessantraege-${itemIndex}`}
              >
                <Icon name="edit" className="text-kern-action-default" />
              </a>
            </div>
            <div className="flex justify-end">
              <DeleteButtonWithJavaScript
                itemIndex={itemIndex}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HauptUndNebenantraege;
