import { Icon } from "~/components/common/Icon";
import { GeldEinklagenAnwaltschaftUserData } from "../../userData";
import { BASE_URL_ZAHLUNGS_ANTRAG } from "./ZahlungsAntragUebersicht";
import { Badge } from "~/components/content/Badge";
import Button from "~/components/common/Button";
import Heading from "~/components/common/Heading";
import { translations } from "~/services/translations/translations";

type SonstigeNebenUndProzessantraegeProps = {
  readonly itemIndex: number;
  readonly item: NonNullable<
    GeldEinklagenAnwaltschaftUserData["allgemeineZahlungsUndNebenantrag"]
  >[number];
  readonly onDelete: (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => Promise<void>;
};

export const ZahlungsAntrag = ({
  itemIndex,
  item,
  onDelete,
}: SonstigeNebenUndProzessantraegeProps) => {
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
              aria-label={""}
              href={"/"}
              className="p-kern-space-small! min-h-0! size-kern-dimension-x-large"
            />
          </div>

          <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
            <div className="flex flex-col">
              <span className="kern-body kern-body--muted">
                <span className="kern-body kern-body--default kern-body--bold text-pretty p-0!">
                  Nebenanträge / Feststellung Annahmeverzug{""}
                </span>
                {""} - Optional
              </span>
              <span className="kern-body kern-body--muted">
                Maximal 7 (inklusive Annahmeverzug)
              </span>
            </div>
            <div>
              <div
                key={""}
                className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
              >
                <div className="kern-body kern-body--default text-pretty flex flex-col">
                  <span className="kern-body max-w-[528px]">
                    a.Die Beklagten zu 1) und zu 2) werden als Gesamtschuldner
                    verurteilt, an die Klagende zu 2) vorgerichtlich angefallene
                    Anwaltskosten in Höhe von 600 Euro nebst Zinsen in Höhe von
                    5 Prozentpunkten über dem jeweiligen Basiszinssatz p.a. seit
                    Rechtshängigkeit zu zahlen.
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
                    aria-label={""}
                    href={"/"}
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
                    aria-label={""}
                    className="p-kern-space-small! min-h-0! border-kern-feedback-danger! size-kern-dimension-x-large"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-start gap-kern-space-x-large">
              <a
                href={"/"}
                className="text-kern-action-default flex items-center pt-24"
              >
                <Icon name="plus" className="text-kern-action-default" />
                Nebenantrag hinzufügen
              </a>
              <a
                href={"/"}
                className="text-kern-action-default flex items-center pt-24"
              >
                <Icon name="plus" className="text-kern-action-default" />
                Annahmeverzug hinzufügen
              </a>
            </div>
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
                aria-label={""}
              >
                Zahlungsantrag {itemIndex + 1} und Nebenanträge löschen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
