import { useId } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";

type Props = {
  title: string;
  description: React.ReactNode;
  onClick: () => void;
  closeDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  pending?: boolean;
};

export const DeleteDialog = ({
  title,
  description,
  onClick,
  closeDialog,
  dialogRef,
  pending = false,
}: Props) => {
  const dialogLabelId = useId();
  const dialogDescriptionId = useId();

  return (
    <dialog
      aria-modal="true"
      ref={dialogRef}
      tabIndex={-1}
      aria-labelledby={dialogLabelId}
      aria-describedby={dialogDescriptionId}
      aria-busy={pending}
      onCancel={(event) => {
        if (pending) event.preventDefault();
      }}
      className="kern-dialog m-auto max-w-l grounded-2xl bg-white p-0"
    >
      <header className="kern-dialog__header">
        <h2
          id={dialogLabelId}
          tabIndex={-1}
          autoFocus
          className="kern-title kern-title--large text-wrap"
        >
          {title}
        </h2>
        <Button
          type="button"
          look="ghost"
          iconLeft={<Icon name="close" className="fill-kern-action-default!" />}
          aria-label={translations.feedback.close.de}
          onClick={closeDialog}
          disabled={pending}
        />
      </header>
      <section id={dialogDescriptionId} className="kern-dialog__body text-wrap">
        {description}
      </section>
      <footer className="kern-dialog__footer">
        <Button
          look="secondary"
          className="kern-btn--large"
          type="button"
          onClick={closeDialog}
          disabled={pending}
        >
          {translations.deleteDialog.cancel.de}
        </Button>

        <Button
          className="bg-kern-feedback-danger! hover:bg-kern-red-500!"
          type="button"
          onClick={onClick}
          disabled={pending}
        >
          {translations.deleteDialog.confirm.de}
        </Button>
      </footer>
    </dialog>
  );
};
