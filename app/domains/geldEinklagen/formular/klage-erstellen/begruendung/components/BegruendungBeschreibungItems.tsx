import Heading from "~/components/common/Heading";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";

type BegruendungBeschreibungItemsProps = {
  readonly itemIndex: number;
  readonly abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number];
};

const BegruendungBeschreibungItems = ({
  itemIndex,
  abschnitte,
}: BegruendungBeschreibungItemsProps) => {
  return (
    <div className="kern-summary">
      <div className="kern-summary__header gap-kern-space-small!">
        <Heading
          text={`Abschnitt ${itemIndex + 1}`}
          tagName="h2"
          managedByParent
          className="kern-body kern-body--bold"
        />
      </div>
      <div className="kern-summary__body bg-white!">
        <dl className="kern-description-list">
          <div className="kern-description-list-item">
            <dt className="kern-description-list-item__key">Beschreibung</dt>
            <dd className="kern-description-list-item__value">
              {abschnitte.beschreibung}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungItems;
