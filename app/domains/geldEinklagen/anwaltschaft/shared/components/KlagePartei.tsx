import {
  type KlageParteiVerhaeltnis,
  type KlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { translations } from "~/services/translations/translations";

type KlageParteiProps = {
  readonly itemIndex: number;
  readonly partei: KlageParteien[number];
  readonly relationship: KlageParteiVerhaeltnis;
};

const KlagePartei = ({ itemIndex, partei, relationship }: KlageParteiProps) => {
  const headingText = `${translations.geldEinklagenAnwaltschaft[relationship === "klagende" ? "klagendeParteiHeadline" : "beklagteParteiHeadline"].de} {${itemIndex}})`;
  return (
    <div data-testid="klage-partei" className="kern-summary pb-24">
      <div className="kern-summary__header">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          id={`partei-${itemIndex}`}
          tabIndex={-1}
        >
          {headingText}
        </h2>
      </div>
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default)">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--default kern-body--bold p-0!">
            {translations.geldEinklagen.begruendungBeschreibungTitle.de}
          </span>
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {partei.parteiverhaeltnis}
          </span>
          {/* <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {partei.beschreibung}
          </span>
          <a
            id={`${EDIT_BUTTON_ID_PREFIX}abschnitte-${itemIndex}`}
            className="kern-link kern-link--default kern-link--bold p-0! no-underline! hover:underline!"
            href={`${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndex}/daten`}
            aria-label={`${headingText} ${translations.arraySummary.arrayEditButtonLabel.de}`}
          >
            <Icon name="edit" className="size-[1em] mb-[3.5px]! inline! mr-4" />
            {translations.geldEinklagen.begruendungBeschreibungEditButton.de}
          </a>
          <BegruendungBeschreibungBeweise
            itemIndex={itemIndex}
            partei={partei}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default KlagePartei;
