import { useEffect } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { translations } from "~/services/translations/translations";

type Props = {
  title: string;
  closeDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
};

const dialogLabelId = "dialog-label";
const dialogDescriptionId = "dialog-description";

export const ReuseBeweiseDialog = ({
  title,
  closeDialog,
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
          onClick={closeDialog}
        />
      </header>
      <section
        id={dialogDescriptionId}
        className="kern-dialog__body text-wrap"
      ></section>
      <footer className="kern-dialog__footer"></footer>
    </dialog>
  );
};
