import { Badge } from "~/components/common/Badge";
import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";
import { personName } from "~/domains/nachlass/erbschein/shared/personName";
import { toDateString } from "~/services/validation/dateObject";
import { migrationDataIsEmpty } from "./hasMissingData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import { commonTranslations } from "~/services/translations/common";
import { componentsTranslations } from "~/services/translations/components";

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
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">
              {commonTranslations.common.name.de}
            </dt>
            <dd className="kern-description-list-item__value">
              {personName(item)}
            </dd>
          </div>
          {"geburtsdatum" in item && (
            <>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">
                  {commonTranslations.common.birthdate.de}
                </dt>
                <dd className="kern-description-list-item__value flex items-center gap-kern-space-small">
                  {!objectKeysNonEmpty(item.geburtsdatum, [
                    "day",
                    "month",
                    "year",
                  ]) ? (
                    <Badge icon="warning" variant="warning">
                      {commonTranslations.common.missingData.de}
                    </Badge>
                  ) : (
                    toDateString(item.geburtsdatum)
                  )}
                </dd>
              </div>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">
                  {commonTranslations.common.birthplace.de}
                </dt>
                <dd className="kern-description-list-item__value">
                  {migrationDataIsEmpty(item.geburtsort) ? (
                    <Badge icon="warning" variant="warning">
                      {commonTranslations.common.missingData.de}
                    </Badge>
                  ) : (
                    item.geburtsort
                  )}
                </dd>
              </div>
            </>
          )}
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">
              {
                componentsTranslations.personSummaryItem
                  .personAliveAtTimeOfDeath.de
              }
            </dt>
            <dd className="kern-description-list-item__value">
              {item.isAlive === "yes"
                ? commonTranslations.common.yes.de
                : commonTranslations.common.no.de}
            </dd>
          </div>
          {"strasse" in item && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">
                {commonTranslations.common.address.de}
              </dt>
              <dd className="kern-description-list-item__value">
                {!objectKeysNonEmpty(item, [
                  "strasse",
                  "hausnummer",
                  "plz",
                  "ort",
                  "land",
                ]) ? (
                  <Badge icon="warning" variant="warning">
                    {commonTranslations.common.missingData.de}
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
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">
                  {commonTranslations.common.deathdate.de}
                </dt>
                <dd className="kern-description-list-item__value">
                  {toDateString(item.sterbedatum)}
                </dd>
              </div>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">
                  {commonTranslations.common.deathplace.de}
                </dt>
                <dd className="kern-description-list-item__value">
                  {item.sterbeort}
                </dd>
              </div>
            </>
          )}
          {item.isAlive === "no" && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">
                {componentsTranslations.personSummaryItem.personHadChildren.de}
              </dt>
              <dd className="kern-description-list-item__value">
                {item.hatteKinder === "yes"
                  ? commonTranslations.common.yes.de
                  : commonTranslations.common.no.de}
              </dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </div>
  );
}
