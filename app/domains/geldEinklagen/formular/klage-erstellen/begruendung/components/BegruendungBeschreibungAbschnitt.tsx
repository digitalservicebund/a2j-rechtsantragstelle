import { Icon } from "~/components/common/Icon";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { BegruendungBeschreibungBeweise } from "./BegruendungBeschreibungBeweise";
import Button from "~/components/common/Button";
import { translations } from "~/services/translations/translations";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungBeschreibung } from "./useBegruendungBeschreibung";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { useRef } from "react";
import { DeleteDialog } from "./DeleteDialog";

export type BegruendungBeschreibungAbschnittProps = {
  readonly itemIndexAbschnitt: number;
  readonly abschnitt: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number];
};

const BegruendungBeschreibungAbschnitt = ({
  itemIndexAbschnitt,
  abschnitt,
}: BegruendungBeschreibungAbschnittProps) => {
  const { onAbschnittDelete } = useBegruendungBeschreibung();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const headingText = `${translations.geldEinklagen.begruendungBeschreibungHeadline.de} ${itemIndexAbschnitt + 1}`;

  const onDeleteClicked = () => {
    dialogRef.current?.showModal();
  };

  const onClickDeleteDialog = () => {
    onAbschnittDelete(BASE_URL_BESCHREIBUNG_ABSCHNITTE, itemIndexAbschnitt);
    dialogRef.current?.close();
  };

  return (
    <div
      data-testid="begruendung-beschreibung-abschnitte"

      className="kern-summary pb-24"
    >
      <div className="kern-summary__header">
        <h2
          className="kern-body kern-body--large kern-body--bold p-0!"
          id={`abschnitt-${itemIndexAbschnitt}`}
          tabIndex={-1}
        >
          {headingText}
        </h2>
      </div>
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-[var(--kern-metric-border-radius-default)]">
        <div className="flex flex-col gap-kern-space-large">
          <span className="kern-body kern-body--default kern-body--bold p-0!">
            {translations.geldEinklagen.begruendungBeschreibungTitle.de}
          </span>
          <span className="kern-body kern-body--default kern-body--regular text-pretty p-0!">
            {abschnitt.beschreibung}
          </span>
          <a
            id={`${EDIT_BUTTON_ID_PREFIX}abschnitte-${itemIndexAbschnitt}`}
            className="kern-link kern-link--default kern-link--bold p-0! no-underline! hover:underline!"
            href={`${BASE_URL_BESCHREIBUNG_ABSCHNITTE}/${itemIndexAbschnitt}/daten`}
            aria-label={`${headingText} ${translations.arraySummary.arrayEditButtonLabel.de}`}
          >
            <Icon name="edit" className="size-[1em] mb-[3.5px]! inline! mr-4" />
            {translations.geldEinklagen.begruendungBeschreibungEditButton.de}
          </a>
          <BegruendungBeschreibungBeweise
            itemIndexAbschnitt={itemIndexAbschnitt}
            abschnitt={abschnitt}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="button"
              aria-haspopup="dialog"
              look="secondary"
              className="border-0!"
              textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
              iconLeft={
                <Icon name={"trash"} className="fill-kern-feedback-danger!" />
              }
              onClick={onDeleteClicked}
              aria-label={`${headingText} ${translations.arraySummary.arrayDeleteButtonLabel.de}`}
            >
              {
                translations.geldEinklagen.begruendungBeschreibungDeleteButton
                  .de
              }
            </Button>
            <DeleteDialog
              title={`${headingText} ${translations.geldEinklagen.begruendungBeschreibungDeleteDialogTitle.de}`}
              description={
                translations.geldEinklagen
                  .begruendungBeschreibungDeleteDialogDescription.de
              }
              onClick={onClickDeleteDialog}
              closeDialog={() => dialogRef.current?.close()}
              dialogRef={dialogRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungAbschnitt;
