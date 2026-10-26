import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";

export const NebenantragItem = () => {
  return (
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
              Anwaltskosten in Höhe von 600 Euro nebst Zinsen in Höhe von 5
              Prozentpunkten über dem jeweiligen Basiszinssatz p.a. seit
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
    </div>
  );
};
