import { useFetcher, useLocation } from "react-router";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { DeleteDialog } from "./DeleteDialog";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { BegruendungBeschreibungBeweise } from "./BegruendungBeschreibungBeweise";
import { translations } from "~/services/translations/translations";
import { BASE_URL_BESCHREIBUNG_ABSCHNITTE } from "./BegruendungBeschreibungUebersicht";
import { useBegruendungBeschreibung } from "./useBegruendungBeschreibung";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";
import { useRef } from "react";
import { DELETE_URL_ENDPOINT } from "~/components/content/arraySummary/ArraySummaryItemActions";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { NoscriptWrapper } from "~/components/common/NoscriptWrapper";

export type BegruendungBeschreibungAbschnittProps = {
  readonly itemIndexAbschnitt: number;
  readonly abschnitt: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >[number];
};

type DeleteButtonProps = {
  readonly itemIndexAbschnitt: number;
  readonly headingText: string;
};

const DeleteButtonWithJavaScript = ({
  headingText,
  itemIndexAbschnitt,
}: DeleteButtonProps) => {
  const { onAbschnittDelete } = useBegruendungBeschreibung();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onClickDeleteDialog = () => {
    void onAbschnittDelete(
      BASE_URL_BESCHREIBUNG_ABSCHNITTE,
      itemIndexAbschnitt,
    );
    dialogRef.current?.close();
  };

  const onDeleteClicked = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
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
        {translations.geldEinklagen.begruendungBeschreibungDeleteButton.de}
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
    </>
  );
};

const DeleteButtonWithoutJavaScript = ({
  headingText,
  itemIndexAbschnitt,
}: DeleteButtonProps) => {
  const fetcher = useFetcher();
  const { pathname } = useLocation();

  return (
    <fetcher.Form method="post" action={DELETE_URL_ENDPOINT}>
      <CsrfInput />
      <input type="hidden" name="pathnameArrayItem" value={pathname} />
      <input type="hidden" name="_jsEnabled" value={"false"} />

      <Button
        type="submit"
        name={"abschnitte"}
        value={itemIndexAbschnitt}
        aria-haspopup="dialog"
        look="secondary"
        className="border-0!"
        textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
        iconLeft={
          <Icon name={"trash"} className="fill-kern-feedback-danger!" />
        }
        aria-label={`${headingText} ${translations.arraySummary.arrayDeleteButtonLabel.de}`}
      >
        {translations.geldEinklagen.begruendungBeschreibungDeleteButton.de}
      </Button>
    </fetcher.Form>
  );
};

const BegruendungBeschreibungAbschnitt = ({
  itemIndexAbschnitt,
  abschnitt,
}: BegruendungBeschreibungAbschnittProps) => {
  const jsAvailable = useJsAvailable();

  const headingText = `${translations.geldEinklagen.begruendungBeschreibungHeadline.de} ${itemIndexAbschnitt + 1}`;

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
            <NoscriptWrapper jsAvailable={jsAvailable}>
              {jsAvailable && (
                <DeleteButtonWithJavaScript
                  headingText={headingText}
                  itemIndexAbschnitt={itemIndexAbschnitt}
                />
              )}

              {!jsAvailable && (
                <DeleteButtonWithoutJavaScript
                  headingText={headingText}
                  itemIndexAbschnitt={itemIndexAbschnitt}
                />
              )}
            </NoscriptWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BegruendungBeschreibungAbschnitt;
