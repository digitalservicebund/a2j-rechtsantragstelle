import { useRef, useState, type ReactNode } from "react";
import Button from "./Button";
import { DeleteDialog } from "./DeleteDialog";
import { Icon } from "./Icon";
import { translations } from "~/services/translations/translations";
import classNames from "classnames";

type DeleteButtonProps = {
  label?: string;
  title: string;
  description: ReactNode;
  className?: string;
  onDelete: () => Promise<void>;
};

export const DeleteButton = ({
  label,
  title,
  description,
  onDelete,
  className,
}: DeleteButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  const deleteItem = async () => {
    setPending(true);
    setHasError(false);
    try {
      await onDelete();
      dialogRef.current?.close();
    } catch {
      setHasError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        aria-haspopup="dialog"
        look="secondary"
        className={classNames("border-0!", className)}
        textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
        iconLeft={<Icon name="trash" className="fill-kern-feedback-danger!" />}
        onClick={() => {
          setHasError(false);
          dialogRef.current?.showModal();
        }}
      >
        {label}
      </Button>
      <DeleteDialog
        title={title}
        description={
          <>
            {description}
            {hasError && (
              <p role="alert" className="text-kern-feedback-danger">
                {translations.deleteDialog.error.de}
              </p>
            )}
          </>
        }
        onClick={() => void deleteItem()}
        closeDialog={() => dialogRef.current?.close()}
        dialogRef={dialogRef}
        pending={pending}
      />
    </>
  );
};
