import { Badge } from "~/components/common/Badge";
import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";
import { personName } from "~/domains/nachlass/erbschein/shared/personName";
import { toDateString } from "~/services/validation/dateObject";

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
            <dt className="kern-description-list-item__key">Name</dt>
            <dd className="kern-description-list-item__value">
              {personName(item)}
            </dd>
          </div>
          {"geburtsdatum" in item && (
            <>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">
                  Geburtsdatum
                </dt>
                <dd className="kern-description-list-item__value">
                  {toDateString(item.geburtsdatum)}
                </dd>
              </div>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">Geburtsort</dt>
                <dd className="kern-description-list-item__value">
                  {item.geburtsort}
                </dd>
              </div>
            </>
          )}
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">
              Lebte zum Todeszeitpunkt?
            </dt>
            <dd className="kern-description-list-item__value">
              {item.isAlive === "yes" ? "Ja" : "Nein"}
            </dd>
          </div>
          {"strasse" in item && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">Adresse</dt>
              <dd className="kern-description-list-item__value">
                {item.strasse} {item.hausnummer}
                {item.adresszusatz ? ` ${item.adresszusatz}` : ""}, {item.plz}{" "}
                {item.ort} ({item.land})
              </dd>
            </div>
          )}
          {"sterbedatum" in item && (
            <>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">Sterbedatum</dt>
                <dd className="kern-description-list-item__value">
                  {toDateString(item.sterbedatum)}
                </dd>
              </div>
              <div className="kern-description-list-item">
                <dt className="kern-description-list-item__key">Sterbeort</dt>
                <dd className="kern-description-list-item__value">
                  {item.sterbeort}
                </dd>
              </div>
            </>
          )}
          {item.isAlive === "no" && (
            <div className="kern-description-list-item">
              <dt className="kern-description-list-item__key">
                Hatte weitere Kinder?
              </dt>
              <dd className="kern-description-list-item__value">
                {item.hatteKinder === "yes" ? "Ja" : "Nein"}
              </dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </div>
  );
}
