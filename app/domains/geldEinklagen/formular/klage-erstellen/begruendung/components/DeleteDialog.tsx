import { useEffect } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";

type Props = {
  title: string;
  description: string;
  onClickDelete: () => void;
  closeSurvey: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
};

const dialogLabelId = "dialog-label";
const dialogDescriptionId = "dialog-description";

export const DeleteDialog = ({
  title,
  description,
  onClickDelete,
  closeSurvey,
  dialogRef,
}: Props) => {
  useEffect(() => {
    const dialog = dialogRef?.current;
    if (!dialog) return;

    if (dialog.open) {
      requestAnimationFrame(() => {
        const heading = dialog.querySelector("h2");
        heading?.focus();
      });
    }
  }, [dialogRef]);

  return (
    <dialog
      aria-modal="true"
      ref={dialogRef}
      tabIndex={-1}
      aria-labelledby={dialogLabelId}
      aria-describedby={dialogDescriptionId}
      className="kern-dialog m-auto max-w-l grounded-2xl bg-white p-0"
    >
      <header className="kern-dialog__header">
        <h2
          id={dialogLabelId}
          tabIndex={-1}
          className="kern-title kern-title--large text-wrap"
        >
          {title}
        </h2>
        <Button
          type="button"
          look="ghost"
          iconLeft={<Icon name="close" className="fill-kern-action-default!" />}
          aria-label={translations.feedback.close.de}
          onClick={closeSurvey}
        />
      </header>
      <section id={dialogDescriptionId} className="kern-dialog__body text-wrap">
        {description}
      </section>
      <footer className="kern-dialog__footer">
        <>
          <Button
            look="secondary"
            className="kern-btn--large"
            type="button"
            onClick={closeSurvey}
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungBeweiseDialogDeleteCancel.de
            }
          </Button>

          <Button
            className="bg-kern-feedback-danger!"
            type="button"
            onClick={onClickDelete}
          >
            {
              translations.geldEinklagen
                .begruendungBeschreibungBeweiseDialogDeleteConfirm.de
            }
          </Button>
        </>
      </footer>
    </dialog>
  );
};
