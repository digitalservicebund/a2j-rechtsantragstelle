import { Icon } from "~/components/common/Icon";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { BegruendungBeschreibungBeweise } from "./BegruendungBeschreibungBeweise";
import Button from "~/components/common/Button";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungBeschreibung } from "./useBegruendungBeschreibung";
import { commonTranslations } from "~/services/translations/common";
import { geldEinklagenTranslations } from "~/services/translations/domains/geldEinklagen";

export type BegruendungBeschreibungAbschnitteProps = {
  readonly itemIndexAbschnitte: number;
  readonly abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number];
};

const BegruendungBeschreibungAbschnitte = ({
  itemIndexAbschnitte,
  abschnitte,
}: BegruendungBeschreibungAbschnitteProps) => {
  const { onAbschnittDelete } = useBegruendungBeschreibung();

  const headingText = `${geldEinklagenTranslations.geldEinklagen.begruendungBeschreibungHeadline.de} ${itemIndexAbschnitte + 1}`;

  return (
    <div
      data-testid="begruendung-beschreibung-abschnitte"

      className="kern-summary pb-24"
    >
      <div className="kern-summary__header">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          id={`abschnitt-${itemIndexAbschnitte}`}
          tabIndex={-1}
        >
          {headingText}
        </h2>
      </div>
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--default kern-body--bold p-0!">
            {
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungTitle.de
            }
          </span>
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {abschnitte.beschreibung}
          </span>
          <a
            className="kern-link kern-link--default kern-link--bold p-0! no-underline! hover:underline!"
            href={`${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitte}/daten`}
            aria-label={`${headingText} ${commonTranslations.common.edit.de}`}
          >
            <Icon name="edit" className="size-[1em] mb-[3.5px]! inline! mr-4" />
            {
              geldEinklagenTranslations.geldEinklagen
                .begruendungBeschreibungEditButton.de
            }
          </a>
          <BegruendungBeschreibungBeweise
            itemIndexAbschnitte={itemIndexAbschnitte}
            abschnitte={abschnitte}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="button"
              look="secondary"
              className="border-0!"
              textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
              iconLeft={
                <Icon name={"trash"} className="fill-kern-feedback-danger!" />
              }
              onClick={() =>
                onAbschnittDelete(
                  BASE_URL_BESCHREIBUNG_ABSCHNITTE,
                  itemIndexAbschnitte,
                )
              }
              aria-label={`${headingText} ${commonTranslations.common.delete.de}`}
            >
              {
                geldEinklagenTranslations.geldEinklagen
                  .begruendungBeschreibungDeleteButton.de
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungAbschnitte;
