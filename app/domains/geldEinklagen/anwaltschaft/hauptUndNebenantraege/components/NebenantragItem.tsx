import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE } from "./BezifferterZahlungsantrag";
import { translations } from "~/services/translations/translations";

const BASE_URL_NEBENANTRAG =
  "/geld-einklagen/anwaltschaft/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege";

type NebenantragItemProps = {
  readonly nebenantrag: {}[] | undefined;
  readonly parentArrayItemIndex: number;
};

export const NebenantragItem = ({
  parentArrayItemIndex,
  nebenantrag,
}: NebenantragItemProps) => {
  const nextItemIndex = nebenantrag?.length ?? 0;

  if (!nebenantrag) {
    return null;
  }

  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      {nebenantrag?.map((item, index) => (
        <>
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
          <div
            key={`hauptantrag-${parentArrayItemIndex}-nebenantrag-`}
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
                aria-label={`Nebenantrag ${parentArrayItemIndex + 1} bearbeiten`}
                href={`${BASE_URL_ALLGEMEINE_ZAHLUNGS_UND_NEBENANTRAEGE}/${parentArrayItemIndex}/daten`}
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
                aria-label={`Nebenantrag ${parentArrayItemIndex + 1} löschen`}
                className="p-kern-space-small! min-h-0! border-kern-feedback-danger! size-kern-dimension-x-large"
              />
            </div>
          </div>
          <div className="flex flex-row justify-start gap-kern-space-x-large">
            <a
              href={`${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/nebenantrag/${nextItemIndex}/daten`}
              aria-label={`Nebenantrag ${nextItemIndex + 1} hinzufügen`}
              className="text-kern-action-default flex items-center pt-24"
            >
              <Icon name="plus" className="text-kern-action-default" />
              {translations.geldEinklagenAnwaltschaft.nebenatragAddButton.de}
            </a>
            <a
              href={`${BASE_URL_NEBENANTRAG}/${parentArrayItemIndex}/annahmeverzug/${nextItemIndex}/daten`}
              aria-label={`Annahmeverzug ${nextItemIndex + 1} hinzufügen`}
              className="text-kern-action-default flex items-center pt-24"
            >
              <Icon name="plus" className="text-kern-action-default" />
              {translations.geldEinklagenAnwaltschaft.annahmeverzugAddButton.de}
            </a>
          </div>
        </>
      ))}
    </div>
  );
};
