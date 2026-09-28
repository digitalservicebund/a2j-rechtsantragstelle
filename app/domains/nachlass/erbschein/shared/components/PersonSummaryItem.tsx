import { Badge } from "~/components/content/Badge";
import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";
import { personName } from "~/domains/nachlass/erbschein/shared/personName";
import { toDateString } from "~/services/validation/dateObject";
import { migrationDataIsEmpty } from "./hasMissingData";
import { translations } from "~/services/translations/translations";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

export function PersonSummaryItem({
  item,
  badgeLabel,
  actions,
}: Readonly<{
  item: PersonItem;
  badgeLabel?: string;
  actions: React.ReactNode;
}>) {
  return (
    <div className="kern-summary">
      <div className="kern-summary__body bg-white!">
        {badgeLabel && (
          <div className="w-fit">
            <Badge icon="group">{badgeLabel}</Badge>
          </div>
        )}
        <dl className="kern-description-list">
          <div className="kern-description-list-item items-center!">
            <dt className="kern-description-list-item__key p-0! items-center!">
              {translations.personSummaryItem.personName.de}
            </dt>
            <dd className="kern-description-list-item__value p-0! content-center!">
              {personName(item)}
            </dd>
          </div>
          {"geburtsdatum" in item && (
            <>
              <div className="kern-description-list-item items-center!">
                <dt className="kern-description-list-item__key p-0! items-center!">
                  {translations.personSummaryItem.personBirthDate.de}
                </dt>
                <dd className="kern-description-list-item__value p-0! items-center!">
                  {!objectKeysNonEmpty(item.geburtsdatum, [
                    "day",
                    "month",
                    "year",
                  ]) ? (
                    <Badge icon="warning" variant="warning">
                      {translations.personSummaryItem.missingData.de}
                    </Badge>
                  ) : (
                    toDateString(item.geburtsdatum)
                  )}
                </dd>
              </div>
              <div className="kern-description-list-item items-center!">
                <dt className="kern-description-list-item__key p-0! items-center!">
                  {translations.personSummaryItem.personBirthPlace.de}
                </dt>
                <dd className="kern-description-list-item__value p-0! items-center!">
                  {migrationDataIsEmpty(item.geburtsort) ? (
                    <Badge icon="warning" variant="warning">
                      {translations.personSummaryItem.missingData.de}
                    </Badge>
                  ) : (
                    item.geburtsort
                  )}
                </dd>
              </div>
            </>
          )}
          <div className="kern-description-list-item items-center!">
            <dt className="kern-description-list-item__key p-0! items-center!">
              {translations.personSummaryItem.personAliveAtTimeOfDeath.de}
            </dt>
            <dd className="kern-description-list-item__value p-0! items-center!">
              {item.isAlive === "yes"
                ? translations.personSummaryItem.yes.de
                : translations.personSummaryItem.no.de}
            </dd>
          </div>
          {"strasse" in item && (
            <div className="kern-description-list-item items-center!">
              <dt className="kern-description-list-item__key p-0! items-center!">
                {translations.personSummaryItem.personAddress.de}
              </dt>
              <dd className="kern-description-list-item__value p-0! items-center!">
                {!objectKeysNonEmpty(item, [
                  "strasse",
                  "hausnummer",
                  "plz",
                  "ort",
                  "land",
                ]) ? (
                  <Badge icon="warning" variant="warning">
                    {translations.personSummaryItem.missingData.de}
                  </Badge>
                ) : (
                  <>
                    {item.strasse} {item.hausnummer}
                    {item.adresszusatz ? ` ${item.adresszusatz}` : ""},{" "}
                    {item.plz} {item.ort} ({item.land})
                  </>
                )}
              </dd>
            </div>
          )}
          {"sterbedatum" in item && (
            <>
              <div className="kern-description-list-item items-center!">
                <dt className="kern-description-list-item__key p-0! items-center!">
                  {translations.personSummaryItem.personDeathDate.de}
                </dt>
                <dd className="kern-description-list-item__value p-0! items-center!">
                  {toDateString(item.sterbedatum)}
                </dd>
              </div>
              <div className="kern-description-list-item items-center!">
                <dt className="kern-description-list-item__key p-0! items-center!">
                  {translations.personSummaryItem.personDeathPlace.de}
                </dt>
                <dd className="kern-description-list-item__value p-0! items-center!">
                  {item.sterbeort}
                </dd>
              </div>
            </>
          )}
          {item.isAlive === "no" && (
            <div className="kern-description-list-item items-center!">
              <dt className="kern-description-list-item__key p-0! items-center!">
                {translations.personSummaryItem.personHadChildren.de}
              </dt>
              <dd className="kern-description-list-item__value p-0! items-center!">
                {item.hatteKinder === "yes"
                  ? translations.personSummaryItem.yes.de
                  : translations.personSummaryItem.no.de}
              </dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </div>
  );
}
