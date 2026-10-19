import { useRef } from "react";
import Button from "~/components/common/Button";
import { Icon } from "~/components/common/Icon";
import { BASE_URL_SONSTIGE_NEBEN_UND_PROZESSANTRAEGE } from "./SonstigeNebenUndProzessantraegeUebersicht";
import { DeleteDialog } from "~/domains/geldEinklagen/formular/klage-erstellen/begruendung/components/DeleteDialog";
import { translations } from "~/services/translations/translations";

type DeleteButtonProps = {
  readonly itemIndex: number;
  readonly onDelete: (
    pathnameArrayItem: string,
    itemIndex: number,
  ) => Promise<void>;
};

export const SonstigeNebenUndProzessantraegeDeleteButton = ({
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
        {translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete.de}
      </Button>

      <DeleteDialog
        title={
          translations.geldEinklagenAnwaltschaft.soenstigeProzessantragDelete.de
        }
        description={
          translations.geldEinklagenAnwaltschaft
            .soenstigeProzessantragDescription.de
        }
        onClick={onClickDeleteDialog}
        closeDialog={() => dialogRef.current?.close()}
        dialogRef={dialogRef}
      />
    </>
  );
};
