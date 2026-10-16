import { useRef } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE } from "./HauptUndNebenantraegeUebersicht";
import { DeleteDialog } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/DeleteDialog";

type DeleteButtonProps = {
  readonly itemIndex: number;
  readonly onDelete: (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => Promise<void>;
};

export const DeleteButtonWithJavaScript = ({
  itemIndex,
  onDelete,
}: DeleteButtonProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onDeleteClicked = () => {
    dialogRef.current?.showModal();
  };

  const onClickDeleteDialog = () => {
    void onDelete(BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE, itemIndex);
    dialogRef.current?.close();
  };

  return (
    <>
      <Button
        type="button"
        aria-haspopup="dialog"
        look="secondary"
        className="border-0!"
        textClassName="kern-body kern-body--default kern-body--regular text-kern-feedback-danger!"
        iconLeft={<Icon name="trash" className="fill-kern-feedback-danger!" />}
        onClick={onDeleteClicked}
        aria-label="Antrag löschen"
      >
        Antrag Löschen
      </Button>

      <DeleteDialog
        title="Antrag Löschen"
        description="Möchten Sie diesen Antrag wirklich löschen?"
        onClick={onClickDeleteDialog}
        closeDialog={() => dialogRef.current?.close()}
        dialogRef={dialogRef}
      />
    </>
  );
};
